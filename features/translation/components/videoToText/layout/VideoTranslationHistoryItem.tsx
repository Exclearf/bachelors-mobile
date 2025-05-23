import Feather from "@expo/vector-icons/Feather";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { useShallow } from "zustand/react/shallow";

import { usePersonalizationStore } from "@/features/settings/stores/personalizationStore";
import Button from "@/features/shared/components/input/Button";
import CircleIndicator from "@/features/shared/components/layout/CircleIndicator";
import ModalWindow from "@/features/shared/components/layout/ModalWindow";
import TranslatedText from "@/features/shared/components/text/TranslatedText";
import { useLocalization } from "@/features/shared/hooks/useLocalization";
import { useTheme } from "@/features/shared/hooks/useTheme";
import { useTranslationStore } from "@/features/translation/stores/useTranslationStore";
import { Gloss } from "@/features/translation/utils/types";

import VideoTranslationResult from "./VideoTranslationResult";

type VideoTranslationHistoryItemProps = {
  gloss: Gloss[];
};

const VideoTranslationHistoryItem = ({
  gloss,
}: VideoTranslationHistoryItemProps) => {
  const [fontSize, fontScale] = usePersonalizationStore(
    useShallow((state) => [state.fontSize, state.fontScale]),
  );
  const getTranslationKey = useLocalization("shared");
  const theme = useTheme();
  const removeVideoFromHistory = useTranslationStore(
    (state) => state.removeVideoFromHistory,
  );
  const [isItemSettingsOpen, setIsItemSettingsOpen] = useState(false);

  return (
    <>
      <View
        style={[
          styles.container,
          {
            backgroundColor: theme?.mutedBackground,
            borderColor: theme?.mutedForeground,
            borderRadius: 10,
            borderWidth: 0.75,
            padding: 3,
          },
        ]}
      >
        <CircleIndicator fillValue={gloss[0].confidence} />
        <TranslatedText style={styles.label} translationKey={gloss[0].value} />
        <Button
          style={styles.moreButton}
          onPress={() => setIsItemSettingsOpen(true)}
        >
          <Feather
            name="more-vertical"
            size={fontSize.medium * fontScale}
            color={theme?.primaryForeground}
          />
        </Button>
      </View>

      <ModalWindow
        isOpen={isItemSettingsOpen}
        closeCallback={() => setIsItemSettingsOpen(false)}
      >
        <ModalWindow.Header translationKey={getTranslationKey("info")} />
        {gloss.map((item) => (
          <VideoTranslationResult gloss={item} key={item.rank} />
        ))}
        <ModalWindow.Footer
          closeCallback={() => setIsItemSettingsOpen(false)}
          buttonStyle={styles.modalButton}
        >
          <Button
            style={styles.modalButton}
            variant="destructive"
            onPress={() => removeVideoFromHistory(gloss)}
          >
            <TranslatedText translationKey="Delete"></TranslatedText>
          </Button>
        </ModalWindow.Footer>
      </ModalWindow>
    </>
  );
};

export default VideoTranslationHistoryItem;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    flex: 1,
    margin: 5,
  },
  moreButton: {
    backgroundColor: "transparent",
    borderWidth: 0,
  },
  label: {
    flex: 1,
    textAlign: "left",
    marginLeft: 5,
  },
  modalButton: {
    borderRadius: 5,
    paddingVertical: 5,
    paddingHorizontal: 10,
    width: "35%",
  },
});
