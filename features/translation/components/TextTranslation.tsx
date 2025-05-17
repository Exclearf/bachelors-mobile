import { useState } from "react";

import {
  useLocalization,
  UseLocalizationFunction,
} from "@/features/shared/hooks/useLocalization";

import TranslationConfirmation from "./layout/TranslationConfirmation";
import useTextTranslation from "../hooks/useTextTranslation";

type TextTranslationProps = {
  photo: string;
  resetPhoto: () => void;
  getTranslationKey: UseLocalizationFunction;
};

const TextTranslation = ({
  photo,
  resetPhoto,
  getTranslationKey,
}: TextTranslationProps) => {
  const [translate] = useTextTranslation(photo);
  getTranslationKey = useLocalization(getTranslationKey("textToVideo"));

  return (
    <>
      <TranslationConfirmation
        fileUri={photo}
        translationKey={getTranslationKey("translationConfirm")}
        cancelCallback={resetPhoto}
        acceptCallback={() => {
          translate();
          resetPhoto();
        }}
      />
    </>
  );
};

export default TextTranslation;
