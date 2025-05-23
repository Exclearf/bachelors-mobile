import FontAwesome from "@expo/vector-icons/FontAwesome";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { AVPlaybackStatusSuccess, ResizeMode, Video } from "expo-av";
import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, TouchableWithoutFeedback, View } from "react-native";

import Spinner from "@/features/shared/components/feedback/Spinner";
import { useTheme } from "@/features/shared/hooks/useTheme";
import { useAnimationPlayer } from "@/features/translation/hooks/useAnimationPlayer";

const controlsSize = 56;

const TextTranslationPlayer = () => {
  const [status, setStatus] = useState<AVPlaybackStatusSuccess>();
  const [isReset, setIsReset] = useState(false);
  const video = useRef<Video>(null);
  const theme = useTheme();

  const controlsColor = theme?.mutedForeground;

  const [currentSources, index, hasFinished, resetPlayback] =
    useAnimationPlayer(status!, "you", "you", "you");

  useEffect(() => {
    const resetAsync = async () => {
      await video.current?.setPositionAsync(0);
      await video.current?.playAsync();
    };
    if (isReset || index !== 0) resetAsync();
  }, [index, isReset]);

  return (
    <View style={styles.contentContainer}>
      <Video
        ref={video}
        source={currentSources[index]}
        style={styles.video}
        onPlaybackStatusUpdate={(status) =>
          setStatus(status as AVPlaybackStatusSuccess)
        }
        useNativeControls={false}
        resizeMode={ResizeMode.COVER}
      />
      {!status?.isLoaded && (
        <Spinner size={controlsSize} color={controlsColor!} />
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
        <View
          style={[
            styles.buttonContrainer,
            {
              backgroundColor: theme?.secondaryBackground,
              height: controlsSize + 10,
              width: controlsSize + 10,
            },
          ]}
        >
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

export default TextTranslationPlayer;

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
    marginBottom: 8,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
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
