import { ToastAndroid } from "react-native";

import { useAuthStore } from "@/features/auth/stores/authStore";

import { useLocalization, UseLocalizationFunction } from "./useLocalization";
import { AnyFunction } from "../types/types";

const notSignedInFallback = (translationFunction: UseLocalizationFunction) =>
  ToastAndroid.show(translationFunction("notLoggedInInfo"), ToastAndroid.SHORT);

const useWrapAuth = <T extends AnyFunction, K extends AnyFunction>(
  funcToWrap: T,
  notSignedInCallback?: K,
): ((...args: Parameters<T>) => ReturnType<T> | void) => {
  const translationFunction = useLocalization("misc");
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

  return isLoggedIn
    ? funcToWrap
    : (notSignedInCallback ?? (() => notSignedInFallback(translationFunction)));
};

export default useWrapAuth;
