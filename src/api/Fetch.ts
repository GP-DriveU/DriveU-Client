const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const baseFetch = async (url: RequestInfo, init?: RequestInit) => {
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
      ...init?.headers,
    },
  });

  if (!res.ok) {
    if (res.status === 401 || res.status === 403 || res.status === 502) {
      alert("세션이 만료되었습니다. 다시 로그인해주세요.");
      localStorage.removeItem("auth-storage");
      localStorage.removeItem("directory-storage");
      localStorage.removeItem("semester-storage");
      localStorage.removeItem("tag-storage");

      window.location.href = "/login";
      return Promise.reject(new Error("Unauthorized, redirected to login"));
    }

    if (res.status === 404) {
      window.location.href = "/404";
      return Promise.reject(new Error("Resource not found, redirected to 404"));
    }

    throw new Error(`HTTP error! status: ${res.status}`);
  }

  const text = await res.text();
  const json = text ? JSON.parse(text) : {};
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
