import { useVideoPlayer, VideoView } from "expo-video";
import { Suspense } from "react";
import { StyleSheet } from "react-native";

type VideoTranslationPlayerProps = {
  videoSource: string;
};

const VideoTranslationPlayer = ({
  videoSource,
}: VideoTranslationPlayerProps) => {
  const player = useVideoPlayer(videoSource, (player) => {
    player.loop = true;
    player.muted = true;
    player.play();
  });

  return <VideoView style={styles.video} player={player} />;
};

const styles = StyleSheet.create({
  video: {
    width: 300,
    height: 300,
  },
});

export default VideoTranslationPlayer;
