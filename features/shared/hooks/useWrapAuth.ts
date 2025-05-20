import { useMemo } from "react";

import { useAuthStore } from "@/features/auth/stores/useAuthStore";

import { useLocalization } from "./useLocalization";
import { AnyFunction } from "../types/types";
import useShowToast from "../utils/showToast";

const useWrapAuth = () => {
  const translationFunction = useLocalization("misc");
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const showToast = useShowToast();

  const callback = useMemo(
    () =>
      <T extends AnyFunction, K extends AnyFunction>(
        funcToWrap: T,
        notSignedInCallback?: K,
      ): ((...args: Parameters<T>) => ReturnType<T> | void) => {
        return isLoggedIn()
          ? funcToWrap
          : (notSignedInCallback ??
              (() => showToast(translationFunction("notLoggedIn"))));
      },
    [isLoggedIn, translationFunction, showToast],
  );

  return callback;
};

export default useWrapAuth;
