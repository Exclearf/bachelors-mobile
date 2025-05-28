import uuid from "react-native-uuid";

import { UseLocalizationFunction } from "@/features/shared/hooks/useLocalization";
import { fetchWithTimoutWrapper } from "@/features/shared/utils/fetch";
import log from "@/features/shared/utils/log";

import { Gloss, UseTranslation } from "../utils/types";

const useVideoTranslationRequest = (
  accessToken: string,
  getTranslationKey: UseLocalizationFunction,
) => {
  const makeRequest: UseTranslation = async (file, controller) => {
    const formData = new FormData();

    formData.append("file", {
      uri: file.uri,
      name: file.name,
      type: "video/mp4",
    } as any);

    formData.append("topK", "15");

    const response = await fetchWithTimoutWrapper(
      "https://bachelors.encape.me/api/translate/video-to-text",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: formData,
      },
      5000,
      controller.current,
    );

    if (!response.ok) {
      log.debug(`Response code: ${response.status}`);
      log.debug(response);
    }
    const json = await response.json();

    return Object.entries(json.glosses)
      .filter(([key]) => key !== "length")
      .map(([, value]) => {
        (value as Gloss).id = uuid.v4();
        return value;
      });
  };

  return [makeRequest];
};

export default useVideoTranslationRequest;
