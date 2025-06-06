const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const baseFetch = async (
  url: RequestInfo,
  init?: RequestInit
  // retry: boolean = true
) => {
  const accessToken = localStorage.getItem("auth-storage");
  let parsedToken: string | null = null;

  if (accessToken) {
    try {
      const parsed = JSON.parse(accessToken);
      parsedToken = parsed.state?.accessToken ?? null;
    } catch (e) {
      console.error("Failed to parse auth-storage:", e);
    }
  }

  const res = await fetch(`${API_BASE_URL}${url}`, {
    ...init,
    headers: {
      ...(parsedToken && {
        Authorization: `Bearer ${parsedToken}`,
      }),
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    if (res.status === 401) {
      localStorage.removeItem("auth-storage");
      window.location.href = "/login";
      return Promise.reject(new Error("Unauthorized, redirected to login"));
    }
    throw new Error(`HTTP error! status: ${res.status}`);
  }

  const json = await res.json();
  return { response: json };
};

const http = {
  get: async <T = any>(url: string, params?: Record<string, string>) => {
    const queryString = params
      ? `?${new URLSearchParams(params).toString()}`
      : "";
    return baseFetch(`${url}${queryString}`, {
      method: "GET",
    }) as Promise<{ response: T }>;
  },
  post: async <T = any>(url: string, body?: any) => {
    return baseFetch(url, {
      method: "POST",
      body: JSON.stringify(body),
    }) as Promise<{ response: T }>;
  },
  put: async <T = any>(url: string, body?: any) => {
    return baseFetch(url, {
      method: "PUT",
      body: JSON.stringify(body),
    }) as Promise<{ response: T }>;
  },
  patch: async <T = any>(url: string, body?: any) => {
    return baseFetch(url, {
      method: "PATCH",
      body: JSON.stringify(body),
    }) as Promise<{ response: T }>;
  },
  delete: async <T = any>(url: string) => {
    return baseFetch(url, {
      method: "DELETE",
    }) as Promise<{ response: T }>;
  },
};

export { http };
