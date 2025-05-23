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
