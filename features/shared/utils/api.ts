import { useAuthStore } from "@/features/auth/stores/authStore";
import { useShallow } from "zustand/react/shallow";

export const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
    const [refreshSession, accessToken] = useAuthStore(
        useShallow((state) => [state.refreshSession, state.accessToken]),
    );

    try {
        const headers = {
            ...options.headers,
            Authorization: `Bearer ${accessToken}`,
        };

        const response = await fetch(url, { ...options, headers });

        if (response.status === 401) {
            const isRefreshed = await refreshSession();
            if (isRefreshed) {
                const newAccessToken = useAuthStore.getState().accessToken;
                headers.Authorization = `Bearer ${newAccessToken}`;
                return fetch(url, { ...options, headers });
            }
        }

        return response;
    } catch (error) {
        console.error("API call failed:", error);
        throw error;
    }
};
