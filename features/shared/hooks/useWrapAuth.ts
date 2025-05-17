import { useMemo } from "react";
import { ToastAndroid } from "react-native";

import { useAuthStore } from "@/features/auth/stores/useAuthStore";

import { useLocalization, UseLocalizationFunction } from "./useLocalization";
import { AnyFunction } from "../types/types";

const notSignedInFallback = (translationFunction: UseLocalizationFunction) =>
  ToastAndroid.show(translationFunction("notLoggedInInfo"), ToastAndroid.SHORT);

const useWrapAuth = () => {
  const translationFunction = useLocalization("misc");
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

  const callback = useMemo(
    () =>
      <T extends AnyFunction, K extends AnyFunction>(
        funcToWrap: T,
        notSignedInCallback?: K,
      ): ((...args: Parameters<T>) => ReturnType<T> | void) => {
        return isLoggedIn
          ? funcToWrap
          : (notSignedInCallback ??
              (() => notSignedInFallback(translationFunction)));
      },
    [isLoggedIn, translationFunction],
  );

  return callback;
};

export default useWrapAuth;
