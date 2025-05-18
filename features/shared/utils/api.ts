import { useShallow } from "zustand/react/shallow";

import { useAuthStore } from "@/features/auth/stores/useAuthStore";

import log from "./log";

export const useFetchWithAuth = (url: string, options: RequestInit = {}) => {
  const [refreshSession, accessToken] = useAuthStore(
    useShallow((state) => [state.refreshSession, state.accessToken]),
  );

  const makeRequest = async () => {
    try {
      const headers = {
        ...options.headers,
        Authorization: `Bearer ${accessToken}`,
      };

      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (response.status === 401) {
        const isRefreshed = await refreshSession();
        if (isRefreshed) {
          const newAccessToken = useAuthStore.getState().accessToken;
          headers.Authorization = `Bearer ${newAccessToken}`;
          return fetch(url, {
            ...options,
            headers,
          });
        }
      }

      return response;
    } catch (error) {
      log.error("API call failed:", error);
      throw error;
    }
  };

  return makeRequest();
};
