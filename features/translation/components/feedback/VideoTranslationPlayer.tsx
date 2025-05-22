import { useVideoPlayer, VideoView } from "expo-video";
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

  return (
    <VideoView
      style={styles.video}
      player={player}
      allowsFullscreen
      allowsPictureInPicture
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
