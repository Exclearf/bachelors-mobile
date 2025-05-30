import { File } from "expo-file-system/next";
import { RefObject } from "react";

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

export type VideoInstance = {
  videoFile: string;
  signType: string;
  dominantStartHandshape: string;
  nonDominantStartHandshape: string;
  dominantEndHandshape: string;
  nonDominantEndHandshape: string;
};

export type GlossTranslation = {
  gloss: string;
  videoInstances: VideoInstance[];
  isTime: boolean;
  special: boolean;
};

export type TranslatedText = {
  id: string;
  extractedText: string;
  translatedVideos: {
    glossTranslations: GlossTranslation[];
    languageCode: string;
  };
};
