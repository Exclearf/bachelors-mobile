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
  getTranslationKey = useLocalization(getTranslationKey("textToVideo"));
  const [translate, isFetching, controller] = useTextTranslation(
    photo,
    getTranslationKey,
  );

  return (
    <>
      <TranslationConfirmation
        fileUri={photo}
        translationKey={getTranslationKey("translationConfirm")}
        cancelCallback={() => {
          if (isFetching) controller.current?.abort("Request aborted.");
          resetPhoto();
        }}
        acceptCallback={() => {
          const callback = async () => {
            if (isFetching) return;

            await translate();
            resetPhoto();
          };
          callback();
        }}
      />
    </>
  );
};

export default TextTranslation;
