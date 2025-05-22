import { LinearGradient } from "expo-linear-gradient";
import React, { useContext } from "react";
import { StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native";
import Animated, { useAnimatedStyle } from "react-native-reanimated";

import { expandableModalStyles } from "@/features/camera/components/modals/ExpandableModal";
import TranslatedText from "@/features/shared/components/text/TranslatedText";
import { AppDimensionsContext } from "@/features/shared/contexts/appDimensions";
import { useLocalization } from "@/features/shared/hooks/useLocalization";
import { useTheme } from "@/features/shared/hooks/useTheme";
import { useTranslationStore } from "@/features/translation/stores/useTranslationStore";

type Props = {
  padding: number;
  height: number;
  containerStyle: StyleProp<ViewStyle>[];
};

const History = ({ padding, containerStyle, height }: Props) => {
  const { width } = useContext(AppDimensionsContext);
  const mode = useTranslationStore((state) => state.mode);
  const getTranslationKey = useLocalization("indexPage");

  const style = useAnimatedStyle(() => {
    return {
      position: "absolute",
      top: height + height * 0.11,
      height: height,
      width: width - padding * 2,
    };
  });

  const videoTranslationHistory = useTranslationStore(
    (state) => state.videoTranslionResults,
  );

  const theme = useTheme();

  return (
    <Animated.View style={[...containerStyle, style, styles.container]}>
      <LinearGradient
        colors={[theme?.primaryBackground!, theme?.background!]}
        start={{
          x: 0,
          y: 0,
        }}
        end={{
          x: 0,
          y: 1,
        }}
        style={styles.gradient}
      >
        <View style={expandableModalStyles.header}>
          <TranslatedText
            isBold={true}
            fontSize="medium"
            style={expandableModalStyles.headerText}
            translationKey={getTranslationKey("translationHistory")}
          />
        </View>
        <Text>{mode === "textToSign" ? "Text History" : "Sign History"}</Text>
      </LinearGradient>
    </Animated.View>
  );
};

export default History;

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  container: { overflow: "hidden" },
});
