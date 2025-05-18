import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";
import { AppState } from "react-native";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

import log from "@/features/shared/utils/log";

import { User } from "../types/types";
import { extractUser, getTokenExp } from "../utils/utils";

type AuthState = {
  loggedIn: boolean;
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
};

type AuthActions = {
  syncAuth: () => Promise<boolean>;
  isLoggedIn: () => boolean;
  setLoggedIn: (isLoggedIn: boolean) => void;
  setUser: (user: AuthState["user"]) => void;
  setAccessToken: (token: string | null) => void;
  setRefreshToken: (token: string | null) => void;
  refreshSession: () => Promise<boolean>;
  signOut: () => Promise<void>;
};

let refreshInFlight: Promise<boolean> | null = null;
let refreshTimer: ReturnType<typeof setTimeout> | null = null;

const withSingleFlight = (fn: () => Promise<boolean>) => {
  if (refreshInFlight) return refreshInFlight;

  refreshInFlight = fn().finally(() => (refreshInFlight = null));

  return refreshInFlight;
};

const scheduleTokenRefresh = (token: string) => {
  const exp = getTokenExp(token);
  if (!exp) return;
  const delay = Math.max(exp * 1000 - Date.now() - 30_000, 5000);
  if (refreshTimer) clearTimeout(refreshTimer);
  refreshTimer = setTimeout(
    () => useAuthStore.getState().refreshSession(),
    delay,
  );
};

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY =
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});

supabase.auth.onAuthStateChange((_event, session) => {
  switch (_event) {
    case "TOKEN_REFRESHED":
    case "SIGNED_IN":
      if (session) {
        useAuthStore.setState({
          accessToken: session.access_token,
          refreshToken: session.refresh_token,
          loggedIn: true,
          user: {
            name: session.user.user_metadata?.full_name ?? "Unknown",
            email: session.user.email ?? "Unknown",
            picture: session.user.user_metadata?.picture ?? null,
          },
        });
        scheduleTokenRefresh(session.access_token);
      }
      break;
    case "SIGNED_OUT":
      if (refreshTimer) clearTimeout(refreshTimer);
      useAuthStore.setState({
        loggedIn: false,
        user: null,
        accessToken: null,
        refreshToken: null,
      });
      break;
    default:
      break;
  }
});

AppState.addEventListener("change", (state) => {
  if (state === "active") {
    useAuthStore.getState().syncAuth();
  }
});

export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    immer((set, get) => ({
      loggedIn: false,
      user: null,
      accessToken: null,
      refreshToken: null,
      isLoggedIn: () => {
        const { accessToken } = get();
        const exp = accessToken ? getTokenExp(accessToken) : null;
        return !!exp && exp * 1000 > Date.now();
      },
      syncAuth: async () => {
        const {
          isLoggedIn,
          loggedIn,
          setLoggedIn,
          refreshSession,
          accessToken,
        } = get();

        const valid = isLoggedIn();
        if (valid) {
          if (!loggedIn) setLoggedIn(true);
          if (accessToken) scheduleTokenRefresh(accessToken);
          return true;
        }

        if (loggedIn) setLoggedIn(false);
        return await refreshSession();
      },
      setLoggedIn: (isLoggedIn) =>
        set((state) => {
          state.loggedIn = isLoggedIn;
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

      refreshSession: async () =>
        withSingleFlight(async () => {
          try {
            const {
              data: { session },
              error,
            } = await supabase.auth.refreshSession();

            if (error || !session) {
              set((state) => {
                state.loggedIn = false;
                state.user = null;
                state.accessToken = null;
                state.refreshToken = null;
              });
              if (refreshTimer) clearTimeout(refreshTimer);
              return false;
            }

            set((state) => {
              state.accessToken = session.access_token;
              state.refreshToken = session.refresh_token;
              state.user = extractUser(session.user);
              state.loggedIn = true;
            });

            scheduleTokenRefresh(session.access_token);
            return true;
          } catch (error) {
            log.error("Error refreshing session:", error);
            if (refreshTimer) clearTimeout(refreshTimer);
            return false;
          }
        }),

      signOut: async () => {
        try {
          await supabase.auth.signOut();
        } finally {
          if (refreshTimer) {
            clearTimeout(refreshTimer);
            refreshTimer = null;
          }
          set((s) => {
            s.loggedIn = false;
            s.user = null;
            s.accessToken = null;
            s.refreshToken = null;
          });
        }
      },
    })),
    {
      name: "auth-store",
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: (state) => {
        state.syncAuth();
      },
    },
  ),
);
