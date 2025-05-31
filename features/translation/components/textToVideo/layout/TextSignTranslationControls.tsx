import { StyleSheet } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

import Button from "@/features/shared/components/input/Button";
import TranslatedText from "@/features/shared/components/text/TranslatedText";
import { GlossTranslation, VideoInstance } from "@/features/shared/types/types";

type Props = {
  currentVideo: GlossTranslation | undefined;
  setCurrentVideoInstance: (videoInstance: VideoInstance) => void;
  currentVideoInstance: VideoInstance | null;
};

const TextSignTranslationControls = ({
  currentVideo,
  setCurrentVideoInstance,
  currentVideoInstance,
}: Props) => {
  return (
    <ScrollView
      horizontal
      directionalLockEnabled
      contentContainerStyle={{
        gap: 5,
      }}
    >
      {currentVideo?.videoInstances.map((item, index) => (
        <Button
          key={index}
          style={styles.videoPicker}
          variant={item === currentVideoInstance ? "primary" : "secondary"}
          onPress={() => setCurrentVideoInstance(item)}
        >
          <TranslatedText translationKey={index.toString()}></TranslatedText>
        </Button>
      ))}
    </ScrollView>
  );
};

export default TextSignTranslationControls;

const styles = StyleSheet.create({
  videoPicker: {
    paddingHorizontal: 10,
    paddingVertical: 0,
    borderRadius: 2.5,
    alignItems: "center",
    justifyContent: "center",
  },
});
