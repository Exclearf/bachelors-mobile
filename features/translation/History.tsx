import { StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native";
import React, { useContext } from "react";
import Animated, { useAnimatedStyle } from "react-native-reanimated";
import { AppDimensionsContext } from "@/features/shared/contexts/appDimensions";
import { useTranslationStore } from "@/features/translation/stores/translationStore";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalization } from "@/features/shared/hooks/useLocalization";
import TranslatedText from "../shared/components/text/TranslatedText";
import { expandableModalStyles } from "../camera/components/modals/ExpandableModal";
import { useTheme } from "../shared/hooks/useTheme";

type Props = {
  padding: number;
  containerStyle: StyleProp<ViewStyle>[];
};

const History = ({ padding, containerStyle }: Props) => {
  const { height, width } = useContext(AppDimensionsContext);
  const mode = useTranslationStore((state) => state.mode);
  const getTranslationKey = useLocalization("indexPage");

  const style = useAnimatedStyle(() => {
    return {
      position: "absolute",
      top: height * 0.55 - height * 0.11 + 3,
      height: height * 0.55 - height * 0.2,
      width: width - padding * 2,
    };
  });
  const theme = useTheme();

  return (
    <Animated.View style={[...containerStyle, style, styles.container]}>
      <LinearGradient
        colors={[theme?.primaryBackground!, theme?.background!]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.gradient}
      >
        <View style={expandableModalStyles.header}>
          <TranslatedText
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
  gradient: {
    flex: 1,
  },
  container: {
    overflow: "hidden",
  },
});
