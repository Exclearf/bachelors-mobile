import { View } from "react-native";
import React from "react";
import { usePersonalizationStore } from "@/features/shared/stores/personalizationStore";
import { useShallow } from "zustand/react/shallow";
import Switch from "@/features/shared/components/input/Switch";
import TranslatedText from "@/features/shared/components/text/TranslatedText";
import Feather from "@expo/vector-icons/Feather";
import Animated from "react-native-reanimated";
import { WithForwardRef } from "@/features/shared/utils/WithForwardRef";
import { AccessibilityItemProps } from "../AccessibilitySection";

type Props = {} & AccessibilityItemProps;

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
  width,
}: Props) => {
  const [isHighContrast, setIsHighContrast] = usePersonalizationStore(
    useShallow((state) => [state.isHighContrast, state.setIsHighContrast]),
  );

  return (
    <>
      <TranslatedText
        style={textStyle}
        translationKey={getTranslationKey("highContrast")}
      />
      <View style={[{ width: width * 0.55 }, containerStyle]}>
        <Switch
          CustomTrueThumb={HighContrastOnIcon}
          CustomFalseThumb={HighContrastOffIcon}
          checked={isHighContrast}
          setChecked={setIsHighContrast}
          diameter={30}
        />
      </View>
    </>
  );
};

export default HighContrastSwitch;
