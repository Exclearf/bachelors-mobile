import React from "react";
import { StyleSheet, View } from "react-native";

import VideoTranslationResult from "./VideoTranslationResult";
import { useTranslationStore } from "../../stores/useTranslationStore";

type SignTranslationProps = {};

const SignTranslation = (props: SignTranslationProps) => {
  const activeVideoTranslationResult = useTranslationStore(
    (state) => state.activeVideoTranslationResult,
  );

  return (
    <View style={styles.contrainer}>
      {activeVideoTranslationResult?.map((entry, index) => (
        <VideoTranslationResult gloss={entry} key={entry.rank} />
      ))}
    </View>
  );
};

export default SignTranslation;

const styles = StyleSheet.create({
  contrainer: {
    padding: 5,
  },
  entry: {
    display: "flex",
    flexDirection: "row",
  },
});
