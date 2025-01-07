import { StyleSheet, View } from "react-native";
import React from "react";
import TranslatedText from "@/features/shared/components/text/TranslatedText";
import { useLocalization } from "@/features/shared/hooks/useLocalization";

const StudyTab = () => {
  const getTranslationKey = useLocalization("studyPage");

  return (
    <View style={{ flex: 1, backgroundColor: "#1e1e1e" }}>
      <View style={styles.headerContainer}>
        <TranslatedText
          style={styles.headerText}
          translationKey={getTranslationKey("headerText")}
        />
      </View>
    </View>
  );
};

export default StudyTab;

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
