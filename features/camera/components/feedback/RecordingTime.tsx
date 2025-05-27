import { useEffect, useRef, useState } from "react";
import { StyleSheet } from "react-native";

import TranslatedText from "@/features/shared/components/text/TranslatedText";

import { useCameraOptionsStore } from "../../stores/useCameraOptionsStore";

type Props = object;

const RecordingTime = (props: Props) => {
  const isRecording = useCameraOptionsStore((state) => state.isFetching);
  const intervalRef = useRef<number | null>(null);
  const initialTime = useRef(Date.now());
  const [currentTime, setCurrentTime] = useState("");

  const resetTimer = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setCurrentTime("");

    intervalRef.current = null;
  };

  useEffect(() => {
    if (isRecording) {
      initialTime.current = Date.now();
      intervalRef.current = setInterval(() => {
        setCurrentTime(() =>
          new Date(Date.now() - initialTime.current)
            .toLocaleString()
            .slice(12, 17)
            .replace(".", ":"),
        );
      }, 500);
    } else {
      resetTimer();
    }
  }, [intervalRef, isRecording]);

  return (
    <TranslatedText
      fontSize="medium"
      style={styles.textStyle}
      translationKey={currentTime}
      translate={false}
    />
  );
};

export default RecordingTime;

const styles = StyleSheet.create({
  textStyle: {
    right: 10,
  },
});
