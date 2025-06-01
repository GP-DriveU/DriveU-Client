import type { User } from "../store/useAuthStore";
import { http } from "./Fetch";

interface OAuthResponse {
  token: {
    accessToken: string;
    refreshToken: string;
  };
}

interface RefreshReponse {
  access_token: string;
}

export const startGoogleLogin = (redirectUri: string) => {
  return `${
    import.meta.env.VITE_API_BASE_URL
  }auth/google?redirect=${encodeURIComponent(redirectUri)}`;
};

export const exchangeGoogleCode = async (code: string, redirectUri: string) => {
  const response = await http.get<OAuthResponse>(
    `auth/code/google?code=${code}&redirect=${encodeURIComponent(redirectUri)}`
  );
  return response.response;
};

export const refreshToken = async (refresh_token: string): Promise<string> => {
  const response = await http.post<RefreshReponse>("/auth/refresh", {
    refresh_token,
  });
  return response.response.access_token;
};

export const getUserInfo = async (): Promise<User> => {
  const { response } = await http.get<User>(`/user/self`);
  return response;
};
