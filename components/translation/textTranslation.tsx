import { StyleSheet, Text, TouchableWithoutFeedback, View } from "react-native";
import React, { Suspense, useEffect, useRef, useState } from "react";
import {
  Video,
  ResizeMode,
  AVPlaybackStatus,
  AVPlaybackStatusSuccess,
} from "expo-av";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { useAnimationPlayer } from "@/hooks/useAnimationPlayer";
import Spinner from "../utils/Spinner";

const videoSource = require("@/assets/signs/you-anim.mp4");
const controlsColor = "rgba(50, 50, 50, 0.95)";
const controlsSize = 56;

type Props = {};

const TextTranslation = (props: Props) => {
  const [status, setStatus] = useState<AVPlaybackStatusSuccess>();
  const [isReset, setIsReset] = useState(false);
  const video = useRef<Video>(null);

  const [currentSources, index, hasFinished, resetPlayback] =
    useAnimationPlayer(status!, "you", "you");

  useEffect(() => {
    console.log("Current Source change");
    const resetAsync = async () => {
      await video.current?.setPositionAsync(0);
      await video.current?.playAsync();
    };
    if (isReset || index !== 0) resetAsync();
  }, [index]);

  return (
    <View style={styles.contentContainer}>
      <Video
        ref={video}
        source={currentSources[index]}
        style={styles.video}
        onPlaybackStatusUpdate={(status) => setStatus(status)}
        useNativeControls={false}
        resizeMode={ResizeMode.COVER}
      />
      {!status?.isLoaded && (
        <Spinner size={controlsSize} color={controlsColor} />
      )}
      <TouchableWithoutFeedback
        onPress={() => {
          if (hasFinished) {
            resetPlayback();
            setIsReset(true);
            return;
          }

          if (status?.isPlaying) {
            video.current?.pauseAsync();
          } else {
            video.current?.playAsync();
          }
        }}
      >
        <View style={styles.buttonContrainer}>
          {hasFinished && (
            <FontAwesome
              name="refresh"
              size={controlsSize}
              color={controlsColor}
            />
          )}
          {!hasFinished &&
            status &&
            (status?.shouldPlay ? (
              <FontAwesome6
                name="stop"
                size={controlsSize}
                color={controlsColor}
              />
            ) : (
              <FontAwesome6
                name="play"
                size={controlsSize}
                color={controlsColor}
              />
            ))}
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
};

export default TextTranslation;

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    position: "relative",
    alignItems: "flex-end",
    flexDirection: "row",
    justifyContent: "space-evenly",
    overflow: "hidden",
    padding: 5,
  },
  buttonContrainer: {
    paddingBottom: 5,
  },
  button: {
    backgroundColor: "rgba(75, 75, 75, 0.5)",
  },
  video: {
    position: "absolute",
    top: 5,
    left: 5,
    borderRadius: 5,
    width: "100%",
    height: "100%",
  },
});
