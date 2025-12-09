import { useAuthStore } from "@/store/useAuthStore";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const refreshAccessToken = async () => {
  const { refreshToken, setTokens, logout } = useAuthStore.getState();

  if (!refreshToken) {
    throw new Error("No refresh token available");
  }

  try {
    const res = await fetch(`${API_BASE_URL}/auth/reissue`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refreshToken }),
    });

    if (!res.ok) {
      throw new Error("Failed to refresh token");
    }

    const data = await res.json();

    setTokens(data.accessToken, data.refreshToken);

    return data.accessToken;
  } catch (error) {
    console.error("Token refresh failed:", error);
    logout();
    window.location.href = "/login";
    throw error;
  }
};

const baseFetch = async (
  url: string,
  init?: RequestInit,
  isRetry = false
): Promise<{ response: any }> => {
  const { accessToken } = useAuthStore.getState();

  const headers = new Headers(init?.headers);
  headers.set("Content-Type", "application/json");
  if (accessToken) {
    headers.set("Authorization", `Bearer ${accessToken}`);
  }

  const response = await fetch(`${API_BASE_URL}${url}`, {
    ...init,
    headers,
  });

  if (!response.ok) {
    if (response.status === 401 && !isRetry) {
      try {
        console.log("Access token expired. Attempting to refresh...");
        const newAccessToken = await refreshAccessToken();

        const retryHeaders = new Headers(init?.headers);
        retryHeaders.set("Content-Type", "application/json");
        retryHeaders.set("Authorization", `Bearer ${newAccessToken}`);

        return baseFetch(url, { ...init, headers: retryHeaders }, true);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }

    if (response.status === 403 || response.status === 502) {
      useAuthStore.getState().logout();
      window.location.href = "/login";
      return Promise.reject(
        new Error("Unauthorized or Server Error, redirected to login")
      );
    }

    if (response.status === 404) {
      window.location.href = "/404";
      return Promise.reject(new Error("Resource not found, redirected to 404"));
    }

    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const text = await response.text();
  const json = text ? JSON.parse(text) : {};

  return { response: json };
};

export const http = {
  get: <T = any>(url: string, params?: Record<string, string>) => {
    const queryString = params
      ? `?${new URLSearchParams(params).toString()}`
      : "";
    return baseFetch(`${url}${queryString}`, { method: "GET" }) as Promise<{
      response: T;
    }>;
  },
  post: <T = any>(url: string, body?: any) => {
    return baseFetch(url, {
      method: "POST",
      body: JSON.stringify(body),
    }) as Promise<{ response: T }>;
  },
  put: <T = any>(url: string, body?: any) => {
    return baseFetch(url, {
      method: "PUT",
      body: JSON.stringify(body),
    }) as Promise<{ response: T }>;
  },
  patch: <T = any>(url: string, body?: any) => {
    return baseFetch(url, {
      method: "PATCH",
      body: JSON.stringify(body),
    }) as Promise<{ response: T }>;
  },
  delete: <T = any>(url: string) => {
    return baseFetch(url, { method: "DELETE" }) as Promise<{ response: T }>;
  },
};
