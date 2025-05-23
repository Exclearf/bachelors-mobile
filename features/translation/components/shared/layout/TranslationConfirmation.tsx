import { Image, View } from "react-native";

import ModalWindow from "@/features/shared/components/layout/ModalWindow";
import { useAppDimensions } from "@/features/shared/hooks/useAppDimensions";
import {
  useLocalization,
  UseLocalizationFunction,
} from "@/features/shared/hooks/useLocalization";
import { useTranslationStore } from "@/features/translation/stores/useTranslationStore";

import VideoTranslationPlayer from "../../videoToText/feedback/VideoTranslationPlayer";

type TranslationConfirmationProps = {
  fileUri: string;
  getTranslationKey: UseLocalizationFunction;
  cancelCallback?: () => void;
  acceptCallback?: () => void;
};

const TranslationConfirmation = ({
  fileUri,
  getTranslationKey,
  acceptCallback,
  cancelCallback,
}: TranslationConfirmationProps) => {
  const { width, height } = useAppDimensions();
  const mode = useTranslationStore((state) => state.mode);
  getTranslationKey = useLocalization(getTranslationKey(mode));

  return (
    <ModalWindow isOpen={fileUri?.length !== 0}>
      <ModalWindow.Header
        translationKey={getTranslationKey("translationConfirm")}
        closeCallback={cancelCallback}
      />
      <View style={{ paddingVertical: 5 }}>
        {mode === "textToSign" ? (
          <Image
            source={{ uri: fileUri }}
            style={{
              width: width * 0.85,
              height: height * 0.2,
              resizeMode: "contain",
            }}
          />
        ) : (
          <VideoTranslationPlayer videoSource={fileUri} />
        )}
      </View>
      <ModalWindow.Footer
        closeCallback={cancelCallback}
        acceptCallback={acceptCallback}
      />
    </ModalWindow>
  );
};

export default TranslationConfirmation;
