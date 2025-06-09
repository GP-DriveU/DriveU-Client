import { create } from "zustand";
import { persist } from "zustand/middleware";

export type User = {
  userId: number;
  name: string;
};

type AuthState = {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isLoggedIn: boolean;
  login: (user: User, accessToken: string, refreshToken: string) => void;
  logout: () => void;
  setTokens: (accessToken: string | null, refreshToken: string | null) => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isLoggedIn: false,
      login: (user, accessToken, refreshToken) => {
        set({ user, accessToken, refreshToken, isLoggedIn: true });
      },
      logout: () => {
        localStorage.removeItem("auth-storage");
        localStorage.removeItem("directory-storage");
        localStorage.removeItem("semester-storage");
        localStorage.removeItem("tag-storage");
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isLoggedIn: false,
        });
      },
      setTokens: (accessToken, refreshToken) => {
        set({ accessToken, refreshToken });
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isLoggedIn: state.isLoggedIn,
      }),
    }
  )
);
