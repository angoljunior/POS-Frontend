
import api, { authClient, refreshAccessToken } from "./axios.js";
import { tokenManager } from "./tokenManager.js";

export const authApi = {
  async login(username, password) {
    const { data } = await authClient.post("auth/login/", {
      username,
      password,
    });

    tokenManager.setAccessToken(data.access);
    tokenManager.setRefreshToken(data.refresh);

    return data;
  },

  async getCurrentUser() {
    const { data } = await api.get("auth/me/");
    return data;
  },

  async getPermissions() {
    const { data } = await api.get("auth/permissions/");
    return data;
  },

  async logout() {
    const refresh = tokenManager.getRefreshToken();

    try {
      if (refresh) {
        // Refresh first so logout uses both the current access token and the
        // latest rotated refresh token. Never retry a stale logout payload.
        const access = await refreshAccessToken();
        await authClient.post("auth/logout/", {
          refresh: tokenManager.getRefreshToken(),
        }, { headers: { Authorization: `Bearer ${access}` } });
      }
    } finally {
      tokenManager.clearTokens();
    }
  },
};
