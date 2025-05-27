import Feather from "@expo/vector-icons/Feather";
import React from "react";
import { View } from "react-native";
import Animated from "react-native-reanimated";
import { useShallow } from "zustand/react/shallow";

import { useSettingsItemWidth } from "@/features/settings/hooks/useSettingsItemWidth";
import { usePersonalizationStore } from "@/features/settings/stores/usePersonalizationStore";
import Switch from "@/features/shared/components/input/Switch";
import { WithForwardRef } from "@/features/shared/components/misc/WithForwardRef";
import TranslatedText from "@/features/shared/components/text/TranslatedText";
import {
  NonFontSizeMultiplier,
  useFontSize,
} from "@/features/shared/hooks/useFontSize";

import { AccessibilityItemProps } from "../AccessibilitySection";

type Props = AccessibilityItemProps;

const HighContrastOnIcon = Animated.createAnimatedComponent(
  WithForwardRef(Feather, { name: "eye" }),
);

const HighContrastOffIcon = Animated.createAnimatedComponent(
  WithForwardRef(Feather, { name: "eye-off" }),
);

const HighContrastSwitch = ({
  getTranslationKey,
  textStyle,
  containerStyle,
}: Props) => {
  const [isHighContrast, setIsHighContrast] = usePersonalizationStore(
    useShallow((state) => [state.isHighContrast, state.setIsHighContrast]),
  );
  const fontSize = useFontSize();
  const { width } = useSettingsItemWidth();

  return (
    <>
      <TranslatedText
        numberOfLines={2}
        style={textStyle}
        translationKey={getTranslationKey("highContrast")}
      />
      <View style={[{ width }, containerStyle]}>
        <Switch
          CustomTrueThumb={HighContrastOnIcon}
          CustomFalseThumb={HighContrastOffIcon}
          checked={isHighContrast}
          setChecked={setIsHighContrast}
          diameter={fontSize["regular"] * NonFontSizeMultiplier}
        />
      </View>
    </>
  );
};

export default HighContrastSwitch;
