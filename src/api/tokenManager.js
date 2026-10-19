
const REFRESH_KEY = "nexapos_refresh_token";

let accessToken = null;

export const tokenManager = {
  getAccessToken() {
    return accessToken;
  },

  setAccessToken(token) {
    accessToken = token || null;
  },

  getRefreshToken() {
    return sessionStorage.getItem(REFRESH_KEY);
  },

  setRefreshToken(token) {
    if (token) {
      sessionStorage.setItem(REFRESH_KEY, token);
    }
  },

  clearTokens() {
    accessToken = null;
    sessionStorage.removeItem(REFRESH_KEY);
  },
};
