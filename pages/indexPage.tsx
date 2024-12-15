import { StyleSheet, Text, View } from "react-native";
import React, { useContext } from "react";
import ExpandableModal from "@/components/modals/expandableModal";
import { useTranslationStore } from "@/stores/translationStore";
import TextTranslation from "@/components/translation/textTranslation";
import SignTranslation from "@/components/translation/signTranslation";
import { AppDimensionsContext } from "@/contexts/appDimensions";

type Props = {};

const IndexPage = (props: Props) => {
  const mode = useTranslationStore((state) => state.mode);
  const { height } = useContext(AppDimensionsContext);

  return (
    <View style={styles.innerContainer}>
      <ExpandableModal
        initialHeight={height * 0.55 - height * 0.11 - 36}
        padding={20}
        containerStyle={styles.expandableModal}
      >
        {mode === "signToText" ? <SignTranslation /> : <TextTranslation />}
      </ExpandableModal>
    </View>
  );
};

export default IndexPage;

const styles = StyleSheet.create({
  innerContainer: {
    position: "relative",
    width: "100%",
    flex: 1,
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  expandableModal: {
    borderRadius: 10,
    backgroundColor: "rgba(100, 100, 100, 0.35)",
    boxShadow: "0px 0px 10px 1px rgba(15,15,15,0.5)",
  },
});
