import { useEffect, useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { StyleProps } from "react-native-reanimated";
import Video, { ResizeMode, VideoRef } from "react-native-video";

import { useAuthStore } from "@/features/auth/stores/useAuthStore";
import Skeleton from "@/features/shared/components/feedback/Skeleton";
import Button from "@/features/shared/components/input/Button";
import TranslatedText from "@/features/shared/components/text/TranslatedText";
import { VideoInstance } from "@/features/shared/types/types";
import { TranslatedTextResponse } from "@/features/translation/utils/types";

import TextSignTranslationControls from "../layout/TextSignTranslationControls";

type Props = {
  activeTextTranslationResult: TranslatedTextResponse | null;
  style?: StyleProps;
  resizeMode?: ResizeMode;
};

const TextSignTranslation = ({
  activeTextTranslationResult,
  style,
  resizeMode,
}: Props) => {
  const accessToken = useAuthStore((state) => state.accessToken);
  const [currentVideo, setCurrentVideo] = useState(
    activeTextTranslationResult?.translatedVideos.glossTranslations[0],
  );
  const videoRef = useRef<VideoRef>(null);
  const [videoFile, setVideoFile] = useState<VideoInstance | null>(null);

  useEffect(() => {
    videoRef.current?.setSource({
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      uri:
        "https://bachelors.encape.me/api/translate/video/" +
        videoFile?.videoFile,
    });
  }, [videoRef, videoFile, accessToken]);

  useEffect(() => {
    setVideoFile(currentVideo?.videoInstances[0] ?? null);
  }, [currentVideo]);

  if (!activeTextTranslationResult) return <></>;

  return (
    <ScrollView contentContainerStyle={[styles.container, style]}>
      <Video
        ref={videoRef}
        muted={true}
        volume={0.0}
        style={[
          styles.glossVideo,
          {
            opacity: videoFile?.videoFile != null ? 1 : 0,
          },
        ]}
        controls
        resizeMode={resizeMode ?? "contain"}
        renderLoader=<Skeleton style={{ height: "100%", width: "100%" }} />
      />
      <View style={styles.glossControls}>
        <TextSignTranslationControls
          currentVideo={currentVideo}
          setCurrentVideoInstance={setVideoFile}
          currentVideoInstance={videoFile}
        />
        <ScrollView
          contentContainerStyle={styles.glossPickerContainer}
          horizontal
          directionalLockEnabled
        >
          {activeTextTranslationResult?.translatedVideos.glossTranslations.map(
            (item, index) =>
              item.special ? (
                <View key={index} style={styles.glossSeparator} />
              ) : (
                <View key={index}>
                  <Button
                    variant={currentVideo === item ? "primary" : "secondary"}
                    onPress={() => setCurrentVideo(item)}
                    style={styles.glossPicker}
                  >
                    <TranslatedText
                      translationKey={item.gloss}
                    ></TranslatedText>
                  </Button>
                </View>
              ),
          )}
        </ScrollView>
      </View>
    </ScrollView>
  );
};

export default TextSignTranslation;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    gap: "1%",
    paddingVertical: 10,
    paddingHorizontal: "3%",
  },
  glossVideo: {
    width: "100%",
    height: "100%",
    flexShrink: 1,
    borderRadius: 5,
    overflow: "hidden",
    marginBottom: 10,
  },
  glossControls: {
    alignItems: "center",
    justifyContent: "space-evenly",
    height: 80,
    gap: 5,
  },
  glossPickerContainer: {
    padding: 5,
    gap: 3,
  },
  glossPicker: {
    paddingHorizontal: 10,
    height: 30,
    borderRadius: 5,
  },
  glossSeparator: {
    padding: 5,
  },
});
