import { StyleSheet, TouchableOpacity, View } from "react-native";

import CircleIndicator from "@/features/shared/components/layout/CircleIndicator";
import TranslatedText from "@/features/shared/components/text/TranslatedText";
import useShowToast from "@/features/shared/utils/showToast";
import { Gloss } from "@/features/translation/utils/types";

type Props = {
  gloss: Gloss;
};

const VideoTranslationResult = ({ gloss }: Props) => {
  const showToast = useShowToast();

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => showToast(`${(gloss.confidence * 100).toFixed(2)}%`)}
      >
        <CircleIndicator fillValue={gloss.confidence} />
      </TouchableOpacity>
      <TranslatedText translationKey={gloss.value} style={styles.glossValue} />
    </View>
  );
};

export default VideoTranslationResult;

const styles = StyleSheet.create({
  container: {
    position: "relative",
    flexDirection: "row",
    marginVertical: 8.5,
    marginHorizontal: 5,
  },
  glossValue: {
    paddingLeft: 13,
  },
});
