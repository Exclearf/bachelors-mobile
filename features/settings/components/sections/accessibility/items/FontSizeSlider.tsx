import { View } from "react-native";
import React from "react";
import Slider from "@/features/shared/components/input/Slider";
import TranslatedText from "@/features/shared/components/text/TranslatedText";
import { AccessibilityItemProps } from "../AccessibilitySection";

type Props = {} & AccessibilityItemProps;

const FontSizeSlider = ({
  getTranslationKey,
  textStyle,
  containerStyle,
  width,
}: Props) => {
  return (
    <>
      <TranslatedText
        style={textStyle}
        translationKey={getTranslationKey("fontSize")}
      />
      <View style={[{ width: width * 0.55 }, containerStyle]}>
        <Slider />
      </View>
    </>
  );
};

export default FontSizeSlider;
