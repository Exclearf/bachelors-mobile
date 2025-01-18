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
        <Slider width={width * 0.55} initialValue={0.5} totalSteps={2} />
      </View>
    </>
  );
};

export default FontSizeSlider;
