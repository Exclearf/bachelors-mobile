import { Image, StyleSheet, View } from "react-native";

import Spinner from "@/features/shared/components/feedback/Spinner";
import ModalWindow from "@/features/shared/components/layout/ModalWindow";
import { useAppDimensions } from "@/features/shared/hooks/useAppDimensions";
import {
  useLocalization,
  UseLocalizationFunction,
} from "@/features/shared/hooks/useLocalization";
import { useTheme } from "@/features/shared/hooks/useTheme";
import { useTranslationStore } from "@/features/translation/stores/useTranslationStore";

import VideoTranslationPlayer from "../../videoToText/feedback/VideoTranslationPlayer";

type TranslationConfirmationProps = {
  fileUri: string;
  getTranslationKey: UseLocalizationFunction;
  isFetching: boolean;
  cancelCallback?: () => void;
  acceptCallback?: () => void;
};

const TranslationConfirmation = ({
  fileUri,
  getTranslationKey,
  isFetching,
  acceptCallback,
  cancelCallback,
}: TranslationConfirmationProps) => {
  const { width, height } = useAppDimensions();
  const mode = useTranslationStore((state) => state.mode);
  const theme = useTheme();
  getTranslationKey = useLocalization(getTranslationKey(mode));

  return (
    <ModalWindow closeCallback={cancelCallback} isOpen={fileUri?.length !== 0}>
      <ModalWindow.Header
        translationKey={getTranslationKey("translationConfirm")}
        closeCallback={cancelCallback}
      />
      <View style={styles.container}>
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
      {isFetching && (
        <View
          style={[
            styles.spinnerContainer,
            { backgroundColor: theme?.background + "CC" },
          ]}
        >
          <Spinner size={32} color={theme?.primaryForeground!} />
        </View>
      )}
      <ModalWindow.Footer
        closeCallback={cancelCallback}
        acceptCallback={acceptCallback}
      />
    </ModalWindow>
  );
};

export default TranslationConfirmation;

const styles = StyleSheet.create({
  container: {
    position: "relative",
    paddingVertical: 5,
  },
  spinnerContainer: {
    position: "absolute",
    height: "100%",
    width: "100%",
    flex: 1,
  },
});
