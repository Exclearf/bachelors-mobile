import React from "react";
import { StyleSheet, View } from "react-native";

import TranslatedText from "@/features/shared/components/text/TranslatedText";
import { useLocalization } from "@/features/shared/hooks/useLocalization";
import { useTheme } from "@/features/shared/hooks/useTheme";
import Test from "@/features/study/components/Test";

const StudyTab = () => {
  const getTranslationKey = useLocalization("studyPage");
  const theme = useTheme();

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: theme?.background,
      }}
    >
      <View style={styles.headerContainer}>
        <TranslatedText
          fontSize="large"
          isBold={true}
          style={[{ color: theme?.primaryForeground }]}
          translationKey={getTranslationKey("headerText")}
        />
      </View>
      <Test />
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
});
