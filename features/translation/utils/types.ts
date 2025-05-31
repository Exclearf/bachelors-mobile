import { File } from "expo-file-system/next";
import { RefObject } from "react";

import { GlossTranslation } from "@/features/shared/types/types";

type UseTranslationReturn = any;

export type UseTranslation = (
  fileUri: File,
  controller: RefObject<AbortController | undefined>,
) => UseTranslationReturn;

export type Gloss = {
  id: string;
  rank: number;
  confidence: number;
  value: string;
};

export type TranslatedVideo = {
  id: string;
  url: string;
  glossValue: string;
};

export type TranslatedTextResponse = {
  id: string;
  extractedText: string;
  translatedVideos: {
    glossTranslations: GlossTranslation[];
    languageCode: string;
  };
};
