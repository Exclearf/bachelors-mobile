import React, { PropsWithChildren, useContext, useEffect } from "react";
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from "react-native-reanimated";
import { ViewStyle } from "react-native";
import { useBottomSheet } from "@/features/shared/hooks/useBottomSheet";
import { IconParameters } from "../../CameraOverlay";
import { AppDimensionsContext } from "@/features/shared/contexts/appDimensions";
import { usePersonalizationStore } from "@/features/settings/stores/personalizationStore";
import { colorKit } from "reanimated-color-picker";

type Props = PropsWithChildren<{
    iconParameters: IconParameters;
    isVisible: boolean;
}>;

const CameraModal = ({ isVisible, iconParameters, children }: Props) => {
    const { width, height } = useContext(AppDimensionsContext);
    const openState = useSharedValue(0);
    const { bottomSheet } = useBottomSheet();
    const theme = usePersonalizationStore((state) => state.theme);

    useEffect(() => {
        openState.set(isVisible ? 1 : 0);
    }, [isVisible]);

    const animatedStyle = useAnimatedStyle(() => {
        const adjustedHeight =
            (height - (bottomSheet?.animatedPosition?.get() ?? 0)) / 4;

        const targetHeight = 300 - Math.min(adjustedHeight, 125);
        return {
            height: targetHeight,
            opacity: withSpring(openState.get(), {
                duration: 150,
            }),
            display: openState.value === 0 ? "none" : "flex",
        };
    });

    const staticStyle = {
        top: iconParameters.size * 1.5,
        left: 15,
        width: width - 30,
        borderWidth: 1,
        borderColor: theme?.mutedBackground,
        backgroundColor: colorKit.setAlpha(theme?.background ?? "#000", 0.9).hex(),
        position: "absolute",
        borderRadius: 10,
    } as ViewStyle;

    return (
        <Animated.View style={[animatedStyle, staticStyle]}>
            {children}
        </Animated.View>
    );
};

export default CameraModal;
