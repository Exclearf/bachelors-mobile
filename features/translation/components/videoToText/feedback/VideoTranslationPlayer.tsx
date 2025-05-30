import { StyleSheet } from "react-native";
import Video from "react-native-video";

type VideoTranslationPlayerProps = {
  videoSource: string;
};

const VideoTranslationPlayer = ({
  videoSource,
}: VideoTranslationPlayerProps) => {
  return (
    <Video
      volume={0.0}
      style={styles.video}
      source={{ uri: videoSource }}
      controls
    />
  );
};

const styles = StyleSheet.create({
  video: {
    width: 300,
    height: 300,
  },
});

export default VideoTranslationPlayer;
