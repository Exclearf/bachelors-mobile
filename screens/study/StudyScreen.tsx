import { StyleSheet, View } from "react-native";
import React from "react";
import { useLocalization } from "@/hooks/useLocalization";
import TranslatedText from "@/components/common/TranslatedText";

const StudyScreen = () => {
  const getTranslationKey = useLocalization("studyPage");

  return (
    <View>
      <View style={styles.headerContainer}>
        <TranslatedText
          style={styles.headerText}
          translationKey={getTranslationKey("headerText")}
        />
      </View>
    </View>
  );
};

export default StudyScreen;

const styles = StyleSheet.create({
  headerContainer: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  headerText: {
    fontSize: 20,
    color: "#fff",
  },
});
