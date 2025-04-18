import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StateCreator } from "zustand";
import { immer } from "zustand/middleware/immer";

export function createPersistedStore<T>(
    storeCreator: StateCreator<T, [], []>,
    key: string,
) {
    return persist(immer(storeCreator), {
        name: key,
        storage: createJSONStorage(() => AsyncStorage),
        partialize: (state: T) => {
            return Object.keys(state)
                .filter((key) => typeof state[key as keyof T] !== "function") // Exclude functions
                .reduce((acc, key) => {
                    acc[key as keyof T] = state[key as keyof T];
                    return acc;
                }, {} as Partial<T>);
        },
    });
}
