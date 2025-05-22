import { UseLocalizationFunction } from "@/features/shared/hooks/useLocalization";
import { fetchWithTimoutWrapper } from "@/features/shared/utils/fetch";
import log from "@/features/shared/utils/log";
import useShowToast from "@/features/shared/utils/showToast";

import { UseTranslation } from "../utils/types";

const useTextTranslationRequest = (
  accessToken: string,
  getTranslationKey: UseLocalizationFunction,
) => {
  const showToast = useShowToast();

  const makeRequest: UseTranslation = async (file, controller) => {
    const photoByteArray = file.bytes();

    log.debug("Start of the translation request for the file.");

    const response = await fetchWithTimoutWrapper(
      "https://bachelors.encape.me/api/translate/text-to-video",
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
      log.warn(`Byte array for file ${file.uri} has issues.`);

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

    log.debug("Removing temporary files.");

    return json;
  };

  return [makeRequest];
};

export default useTextTranslationRequest;
