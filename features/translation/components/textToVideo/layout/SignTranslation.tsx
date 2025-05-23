import React from "react";
import { StyleSheet, View } from "react-native";

import { useTranslationStore } from "@/features/translation/stores/useTranslationStore";

import VideoTranslationResult from "../../videoToText/layout/VideoTranslationResult";

type SignTranslationProps = object;

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
