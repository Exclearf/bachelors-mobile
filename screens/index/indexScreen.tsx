import { StyleSheet, View } from "react-native";
import React, { useContext } from "react";
import ExpandableModal from "@/components/modals/expandableModal";
import { useTranslationStore } from "@/stores/translationStore";
import TextTranslation from "@/screens/index/components/textTranslation";
import SignTranslation from "@/screens/index/components/signTranslation";
import { AppDimensionsContext } from "@/contexts/appDimensions";
import History from "@/screens/index/components/history";
import { useLocalization } from "@/hooks/useLocalization";

const IndexScreen = () => {
  const mode = useTranslationStore((state) => state.mode);
  const { height } = useContext(AppDimensionsContext);
  const getTranslationKey = useLocalization("indexPage");

  return (
    <View style={styles.innerContainer}>
      <ExpandableModal
        initialHeight={height * 0.55 - height * 0.11 - 36}
        padding={20}
        containerStyle={[styles.indexSection, styles.translationSection]}
        titleTranslationKey={getTranslationKey("translation")}
      >
        {mode === "signToText" ? <SignTranslation /> : <TextTranslation />}
      </ExpandableModal>
      <History padding={20} containerStyle={[styles.indexSection]} />
    </View>
  );
};

export default IndexScreen;

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
});
