import { StyleSheet, View } from "react-native";
import React from "react";
import AppThemeSwitch from "./items/AppThemeSwitch";
import ThemeColorSlider from "./items/ThemeColorPanel";
import { SettingsSectionsItemType } from "../../../SettingsSections";
import { useLocalization } from "@/features/shared/hooks/useLocalization";

type Props = SettingsSectionsItemType;

const PersonalizationSection = ({
    getTranslationKey,
    style,
    textStyle,
}: Props) => {
    const items = [AppThemeSwitch, ThemeColorSlider];
    getTranslationKey = useLocalization(
        getTranslationKey("personalizationSection"),
    );

    return (
        <>
            {items.map((Item, index) => (
                <View style={[style, styles.containerItem]} key={index}>
                    <Item getTranslationKey={getTranslationKey} textStyle={textStyle} />
                </View>
            ))}
        </>
    );
};

export default PersonalizationSection;

const styles = StyleSheet.create({
    containerItem: {
        paddingVertical: 10,
    },
});
