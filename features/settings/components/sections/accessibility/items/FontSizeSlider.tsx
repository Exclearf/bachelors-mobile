import { View } from "react-native";
import React from "react";
import Slider from "@/features/shared/components/input/Slider";
import TranslatedText from "@/features/shared/components/text/TranslatedText";
import { AccessibilityItemProps } from "../AccessibilitySection";
import { usePersonalizationStore } from "@/features/settings/stores/personalizationStore";
import { useShallow } from "zustand/react/shallow";
import { useSettingsItemWidth } from "@/features/settings/hooks/useSettingsItemWidth";

type Props = AccessibilityItemProps;

const FontSizeSlider = ({
    getTranslationKey,
    textStyle,
    containerStyle,
}: Props) => {
    const fontSizeMultipliers = [1, 1.07, 1.14];
    const [fontScale, setFontScale] = usePersonalizationStore(
        useShallow((state) => [state.fontScale, state.setFontScale]),
    );
    const { width } = useSettingsItemWidth();

    return (
        <>
            <TranslatedText
                style={textStyle}
                translationKey={getTranslationKey("fontSize")}
            />
            <View style={[{ width }, containerStyle]}>
                <Slider
                    width={width}
                    initialValue={fontSizeMultipliers.indexOf(fontScale)}
                    totalSteps={2}
                    onChangeHandler={(newIndex) =>
                        setFontScale(fontSizeMultipliers[newIndex])
                    }
                />
            </View>
        </>
    );
};

export default FontSizeSlider;
