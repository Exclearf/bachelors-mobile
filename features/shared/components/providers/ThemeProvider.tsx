import React, { PropsWithChildren, useEffect } from "react";
import { useShallow } from "zustand/react/shallow";
import { usePersonalizationStore } from "../../../settings/stores/personalizationStore";
import { useColorScheme } from "react-native";
import {
    argbFromHex,
    themeFromSourceColor,
} from "@material/material-color-utilities";
import { generateTheme } from "../../utils/themes";
import { colorKit } from "reanimated-color-picker";
type Props = PropsWithChildren<{}>;

// TODO: Extract the logic from this component into a custom hook
const ThemeProvider = ({ children }: Props) => {
    const [setTheme, themeType, setThemeType, isHighContrast, accentColor] =
        usePersonalizationStore(
            useShallow((state) => [
                state.setTheme,
                state.themeType,
                state.setThemeType,
                state.isHighContrast,
                state.accentColor,
            ]),
        );

    const colorScheme = useColorScheme();

    useEffect(() => {
        if (themeType == null) {
            setThemeType(colorScheme);
        }
    }, []);

    useEffect(() => {
        console.log(`Using accent color: ${accentColor}`);
        const theme = themeFromSourceColor(argbFromHex(colorKit.HEX(accentColor)));
        const newTheme = generateTheme(
            theme,
            themeType,
            isHighContrast,
            colorKit.HEX(accentColor),
        );

        setTheme(newTheme);
    }, [themeType, isHighContrast, accentColor]);

    return <>{children}</>;
};

export default ThemeProvider;
