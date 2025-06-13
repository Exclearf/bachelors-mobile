import Feather from "@expo/vector-icons/Feather";
import { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { useShallow } from "zustand/react/shallow";

import { usePersonalizationStore } from "@/features/settings/stores/usePersonalizationStore";
import Button from "@/features/shared/components/input/Button";
import CircleIndicator from "@/features/shared/components/layout/CircleIndicator";
import ModalWindow from "@/features/shared/components/layout/ModalWindow";
import TranslatedText from "@/features/shared/components/text/TranslatedText";
import {
  useLocalization,
  UseLocalizationFunction,
} from "@/features/shared/hooks/useLocalization";
import { useTheme } from "@/features/shared/hooks/useTheme";
import { useTranslationStore } from "@/features/translation/stores/useTranslationStore";
import { Gloss } from "@/features/translation/utils/types";

import VideoTranslationResult from "./VideoTranslationResult";

type VideoTranslationHistoryItemProps = {
  gloss: Gloss[];
  getTranslationKey: UseLocalizationFunction;
};

const VideoTranslationHistoryItem = ({
  gloss,
  getTranslationKey,
}: VideoTranslationHistoryItemProps) => {
  const [fontSize, fontScale] = usePersonalizationStore(
    useShallow((state) => [state.fontSize, state.fontScale]),
  );
  getTranslationKey = useLocalization(getTranslationKey("shared"));
  const theme = useTheme();
  const removeVideoTranslationFromHistory = useTranslationStore(
    (state) => state.removeVideoTranslationFromHistory,
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
        style={{ maxHeight: "50%" }}
      >
        <ModalWindow.Header translationKey={getTranslationKey("info")} />

        <ScrollView style={{ flexGrow: 0, marginVertical: 15 }}>
          {gloss.map((item) => (
            <VideoTranslationResult gloss={item} key={item.rank} />
          ))}
        </ScrollView>
        <ModalWindow.Footer
          closeCallback={() => setIsItemSettingsOpen(false)}
          buttonStyle={styles.modalButton}
        >
          <Button
            style={styles.modalButton}
            variant="destructive"
            onPress={() => removeVideoTranslationFromHistory(gloss)}
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
