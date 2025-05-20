import { File } from "expo-file-system/next";
import { useRef, useState } from "react";

import { useAuthStore } from "@/features/auth/stores/useAuthStore";
import { UseLocalizationFunction } from "@/features/shared/hooks/useLocalization";
import { fetchWithTimoutWrapper } from "@/features/shared/utils/fetch";
import log from "@/features/shared/utils/log";
import useShowToast from "@/features/shared/utils/showToast";

const useTextTranslation = (
  fileUri: string,
  getTranslationKey: UseLocalizationFunction,
) => {
  const accessToken = useAuthStore((state) => state.accessToken);
  const [isFetching, setIsFetching] = useState(false);
  const showToast = useShowToast();
  const controller = useRef<AbortController | undefined>(undefined);

  const translate = async () => {
    if (isFetching) return;

    controller.current = new AbortController();

    log.debug(`Processing the file "${fileUri}".`);

    setIsFetching(true);

    const photoFile = new File(fileUri);

    if (!photoFile.exists) {
      log.warn(`File ${fileUri} does not exist.`);
      showToast(getTranslationKey("tryAgain"));

      return;
    }

    const photoByteArray = photoFile.bytes();

    log.debug("Start of the translation request for the file.");

    try {
      const response = await fetchWithTimoutWrapper(
        "http://10.205.0.32:5000/api/translate/text-to-video",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/octet-stream",
            Authorization: `Bearer ${accessToken}`,
          },
          body: photoByteArray,
        },
        5000,
        controller.current,
      );

      if (response.status === 400) {
        log.warn(`Byte array for file ${fileUri} has issues.`);

        showToast(getTranslationKey("tryAgain"));

        return;
      }

      if (response.status === 204) {
        log.debug("No text was detected.");

        showToast(getTranslationKey("noText"));

        return;
      }

      const json = await response.json();
      log.debug(`Extracted text: ${json.extractedText}`);
    } catch (err) {
      log.error(err);
      if (err instanceof Error) {
        showToast(err.message);
      }
    } finally {
      setIsFetching(false);
      controller.current = undefined;
      log.debug("End of the translation request for the file.");
    }

    photoFile.delete();
  };

  return [translate, isFetching, controller] as const;
};

export default useTextTranslation;
