
import axios from "axios";
import { tokenManager } from "./tokenManager.js";

const BASE_URL =
  import.meta.env?.VITE_API_BASE_URL ||
  "http://127.0.0.1:8000/api/v1/";

// Separate client for authentication endpoints.
// Avoids triggering the protected-API interceptor.
export const authClient = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
});

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
});

let refreshPromise = null;
let onSessionExpired = null;

export function setSessionExpiredHandler(callback) {
  onSessionExpired = callback;
}

export async function refreshAccessToken() {
  const refresh = tokenManager.getRefreshToken();

  if (!refresh) {
    throw new Error("No refresh token available.");
  }

  if (!refreshPromise) {
    refreshPromise = authClient
      .post("auth/token/refresh/", { refresh })
      .then(({ data }) => {
        if (tokenManager.getRefreshToken() !== refresh) {
          throw new Error("Session changed while refreshing.");
        }
        tokenManager.setAccessToken(data.access);

        // SimpleJWT returns a new refresh token
        // when rotation is enabled.
        if (data.refresh) {
          tokenManager.setRefreshToken(data.refresh);
        }

        return data.access;
      })
      .catch((error) => {
        if (tokenManager.getRefreshToken() === refresh &&
            [400, 401, 403].includes(error.response?.status)) {
          tokenManager.clearTokens();
          onSessionExpired?.();
        }
        throw error;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
}

// Attach Bearer access token to every protected request.
api.interceptors.request.use((config) => {
  const access = tokenManager.getAccessToken();

  if (access) {
    config.headers.Authorization = `Bearer ${access}`;
  }

  return config;
});

// Refresh expired JWT and retry once.
api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status !== 401 ||
      !originalRequest
    ) {
      return Promise.reject(error);
    }

    if (originalRequest._retry) {
      tokenManager.clearTokens();
      onSessionExpired?.();
      return Promise.reject(error);
    }

    if (!tokenManager.getRefreshToken()) {
      tokenManager.clearTokens();
      onSessionExpired?.();
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      // Another concurrent request may already have refreshed this token.
      const currentAccess = tokenManager.getAccessToken();
      const newAccess = currentAccess &&
        originalRequest.headers.Authorization !== `Bearer ${currentAccess}`
        ? currentAccess
        : await refreshAccessToken();

      originalRequest.headers.Authorization =
        `Bearer ${newAccess}`;

      return api(originalRequest);
    } catch (refreshError) {
      return Promise.reject(refreshError);
    }
  }
);

export default api;
