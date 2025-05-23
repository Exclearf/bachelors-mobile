import { File } from "expo-file-system/next";
import { useRef, useState } from "react";

import { useAuthStore } from "@/features/auth/stores/useAuthStore";
import { UseLocalizationFunction } from "@/features/shared/hooks/useLocalization";
import log from "@/features/shared/utils/log";
import useShowToast from "@/features/shared/utils/showToast";

import useTextTranslationRequest from "./useTextTranslationRequest";
import useVideoTranslationRequest from "./useVideoTranslationRequest";
import { useTranslationStore } from "../stores/useTranslationStore";

const useAssetTranslation = (
  fileUri: string,
  getTranslationKey: UseLocalizationFunction,
) => {
  const mode = useTranslationStore((state) => state.mode);
  const [isFetching, setIsFetching] = useState(false);
  const showToast = useShowToast();
  const controller = useRef<AbortController | undefined>(undefined);
  const accessToken = useAuthStore((state) => state.accessToken);
  const [makePhotoRequest] = useTextTranslationRequest(
    accessToken!,
    getTranslationKey,
  );
  const [makeVideoRequest] = useVideoTranslationRequest(
    accessToken!,
    getTranslationKey,
  );
  const [isAborted, setIsAborted] = useState(false);

  const addVideoTranslationResult = useTranslationStore(
    (state) => state.addVideoTranslationResult,
  );

  const translate = async () => {
    if (isFetching) return;

    controller.current = new AbortController();

    log.debug(`Processing the file "${fileUri}".`);

    setIsAborted(false);
    setIsFetching(true);

    try {
      const file = new File(fileUri);

      if (!file.exists) {
        log.warn(`File ${fileUri} does not exist.`);

        showToast(getTranslationKey("tryAgain"));

        return;
      }

      switch (mode) {
        case "textToSign":
          await makePhotoRequest(file, controller);
          break;
        case "signToText":
          const result = await makeVideoRequest(file, controller);
          addVideoTranslationResult(result);
          break;
      }

      file.delete();
    } catch (err) {
      log.error(err);

      if (err instanceof Error) {
        showToast(err.message);
      }
    } finally {
      setIsFetching(false);
      setIsAborted(controller.current.signal.aborted);
      controller.current = undefined;
      log.debug("End of the translation request for the file.");
    }
  };

  return [translate, isFetching, controller, isAborted] as const;
};

export default useAssetTranslation;
