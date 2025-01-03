import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

type User = {
  name: string;
  email: string;
  picture: string;
};

type AuthState = {
  isLoggedIn: boolean;
  user: User | null;
  accessToken: string | null;
};

type AuthActions = {
  setIsLoggedIn: (isLoggedIn: boolean) => void;
  setUser: (user: AuthState["user"]) => void;
  setAccessToken: (token: string) => void;
};

export const useAuth = create<AuthState & AuthActions>()(
  immer((set) => ({
    isLoggedIn: false,
    user: null,
    accessToken: null,
    setIsLoggedIn: (isLoggedIn) =>
      set((state) => {
        state.isLoggedIn = isLoggedIn;
      }),
    setUser: (user) =>
      set((state) => {
        state.user = user;
      }),
    setAccessToken: (token) =>
      set((state) => {
        state.accessToken = token;
      }),
  })),
);
