import { http } from "@/api/Fetch";
import type { TermType } from "@/types/semester";

interface OAuthResponse {
  user: {
    userId: number;
    name: string;
  };
  semesters: {
    userSemesterId: number;
    year: number;
    term: TermType;
    isCurrent: boolean;
  }[];
  token: {
    accessToken: string;
    refreshToken: string;
  };
  directories: {
    id: number;
    name: string;
    order: number;
    is_default: boolean;
    children: {
      id: number;
      name: string;
      order: number;
      is_default: boolean;
      children: any[];
    }[];
  }[];
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
