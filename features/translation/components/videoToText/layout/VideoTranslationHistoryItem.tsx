import Feather from "@expo/vector-icons/Feather";
import { StyleSheet, View } from "react-native";
import { useShallow } from "zustand/react/shallow";

import { usePersonalizationStore } from "@/features/settings/stores/personalizationStore";
import Button from "@/features/shared/components/input/Button";
import CircleIndicator from "@/features/shared/components/layout/CircleIndicator";
import TranslatedText from "@/features/shared/components/text/TranslatedText";
import { useTheme } from "@/features/shared/hooks/useTheme";
import { Gloss } from "@/features/translation/utils/types";

type VideoTranslationHistoryItemProps = {
  gloss: Gloss[];
};

const VideoTranslationHistoryItem = ({
  gloss,
}: VideoTranslationHistoryItemProps) => {
  const [fontSize, fontScale] = usePersonalizationStore(
    useShallow((state) => [state.fontSize, state.fontScale]),
  );
  const theme = useTheme();

  return (
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
      <Button style={styles.moreButton}>
        <Feather
          name="more-vertical"
          size={fontSize.medium * fontScale}
          color={theme?.primaryForeground}
        />
      </Button>
    </View>
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
});
