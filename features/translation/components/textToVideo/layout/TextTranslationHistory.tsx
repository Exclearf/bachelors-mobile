import Feather from "@expo/vector-icons/Feather";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { ResizeMode } from "react-native-video";
import { useShallow } from "zustand/react/shallow";

import { usePersonalizationStore } from "@/features/settings/stores/usePersonalizationStore";
import Button from "@/features/shared/components/input/Button";
import ModalWindow from "@/features/shared/components/layout/ModalWindow";
import TranslatedText from "@/features/shared/components/text/TranslatedText";
import { useTheme } from "@/features/shared/hooks/useTheme";
import { useTranslationStore } from "@/features/translation/stores/useTranslationStore";
import { TranslatedTextResponse } from "@/features/translation/utils/types";

import TextSignTranslation from "../feedback/TextSignTranslation";

type Props = object;

const TextTranslationHistory = (props: Props) => {
  const translationHistory = useTranslationStore(
    (state) => state.textTranslationResults,
  );
  const [currentItem, setCurrentItem] = useState<TranslatedTextResponse | null>(
    null,
  );
  const [fontSize, fontScale] = usePersonalizationStore(
    useShallow((state) => [state.fontSize, state.fontScale]),
  );
  const theme = useTheme();

  return (
    <>
      <ScrollView>
        {translationHistory?.map((item) => (
          <View
            key={item.id}
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
            <MaterialCommunityIcons
              name="text-short"
              size={fontSize.medium * fontScale}
              color={theme?.primaryForeground}
            />
            <ScrollView style={styles.label} horizontal>
              <TranslatedText translationKey={item.extractedText} />
            </ScrollView>
            <Button
              style={styles.moreButton}
              onPress={() => setCurrentItem(item)}
            >
              <Feather
                name="more-vertical"
                size={fontSize.medium * fontScale}
                color={theme?.primaryForeground}
              />
            </Button>
          </View>
        ))}
      </ScrollView>

      <ModalWindow
        isOpen={currentItem != null}
        style={{ height: "50%", width: "90%", overflow: "hidden" }}
      >
        <ModalWindow.Header
          closeCallback={() => setCurrentItem(null)}
          translationKey=""
        />
        <TextSignTranslation
          resizeMode={ResizeMode.CONTAIN}
          activeTextTranslationResult={currentItem!}
        />
      </ModalWindow>
    </>
  );
};

export default TextTranslationHistory;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    flex: 1,
    margin: 5,
    paddingHorizontal: 15,
    paddingVertical: 12,
  },
  moreButton: {
    backgroundColor: "transparent",
    borderWidth: 0,
  },
  label: { maxWidth: "85%" },
});
