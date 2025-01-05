import { createClient } from "@supabase/supabase-js";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

type UserPicture =
  | {
      uri: string;
    }
  | number;

type User = {
  name: string;
  email: string;
  picture: UserPicture;
};

type AuthState = {
  isLoggedIn: boolean;
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
};

type AuthActions = {
  setIsLoggedIn: (isLoggedIn: boolean) => void;
  setUser: (user: AuthState["user"]) => void;
  setAccessToken: (token: string | null) => void;
  setRefreshToken: (token: string | null) => void;
  refreshSession: () => Promise<boolean>;
  signOut: () => Promise<void>;
};

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY =
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});

export const useAuthStore = create<AuthState & AuthActions>()(
  immer((set) => ({
    isLoggedIn: false,
    user: null,
    accessToken: null,
    refreshToken: null,

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

    setRefreshToken: (token) =>
      set((state) => {
        state.refreshToken = token;
      }),

    refreshSession: async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.refreshSession();

        if (error || !session) {
          set((state) => {
            state.isLoggedIn = false;
            state.user = null;
            state.accessToken = null;
            state.refreshToken = null;
          });
          return false;
        }

        set((state) => {
          state.accessToken = session.access_token;
          state.refreshToken = session.refresh_token;
          if (session.user?.user_metadata) {
            state.user = {
              name: session.user.user_metadata.full_name || "Unknown",
              email: session.user.email || "Unknown",
              picture: session.user.user_metadata.picture || null,
            };
          }
          state.isLoggedIn = true;
        });

        return true;
      } catch (error) {
        console.error("Error refreshing session:", error);
        return false;
      }
    },

    signOut: async () => {
      try {
        await supabase.auth.signOut();
        set((state) => {
          state.isLoggedIn = false;
          state.user = null;
          state.accessToken = null;
          state.refreshToken = null;
        });
      } catch (error) {
        console.error("Error signing out:", error);
      }
    },
  })),
);
