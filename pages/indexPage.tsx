import { StyleSheet, Text, View } from "react-native";
import React, { useContext } from "react";
import ExpandableModal from "@/components/modals/expandableModal";
import { useTranslationStore } from "@/stores/translationStore";
import TextTranslation from "@/components/translation/textTranslation";
import SignTranslation from "@/components/translation/signTranslation";
import { AppDimensionsContext } from "@/contexts/appDimensions";
import History from "@/components/translation/history";

type Props = {};

const IndexPage = (props: Props) => {
  const mode = useTranslationStore((state) => state.mode);
  const { height } = useContext(AppDimensionsContext);

  return (
    <View style={styles.innerContainer}>
      <ExpandableModal
        initialHeight={height * 0.55 - height * 0.11 - 36}
        padding={20}
        containerStyle={[styles.indexSection, styles.translationSection]}
      >
        {mode === "signToText" ? <SignTranslation /> : <TextTranslation />}
      </ExpandableModal>
      <History
        padding={20}
        containerStyle={[styles.indexSection, styles.historySection]}
      />
    </View>
  );
};

export default IndexPage;

const styles = StyleSheet.create({
  innerContainer: {
    position: "relative",
    width: "100%",
    flex: 1,
    display: "flex",
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  indexSection: {
    borderRadius: 10,
    boxShadow: "0px 0px 10px 1px rgba(15,15,15,0.5)",
  },
  translationSection: {
    backgroundColor: "rgba(75, 75, 75, 1)",
  },
  historySection: { backgroundColor: "rgba(75, 75, 75, 0.5)" },
});
