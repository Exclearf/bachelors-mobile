import { StyleSheet, ViewStyle } from "react-native";
import React, { useEffect } from "react";
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withTiming,
} from "react-native-reanimated";
import { colorKit } from "reanimated-color-picker";
import { usePersonalizationStore } from "@/features/settings/stores/personalizationStore";

type Props = {
    style: ViewStyle;
};

const Skeleton = ({ style }: Props) => {
    const opacity = useSharedValue(0.75);
    const theme = usePersonalizationStore((state) => state.theme);
    const color = colorKit.RGB(theme?.secondaryBackground ?? "#000000").array();
    useEffect(() => {
        opacity.set(withRepeat(withTiming(1, { duration: 1000 }), -1, true));
    }, []);

    const animatedStyle = useAnimatedStyle(() => {
        const currentOpacity = opacity.get();
        return {
            backgroundColor: `rgba(${color[0] * currentOpacity},${color[1] * currentOpacity},${color[2] * currentOpacity},1)`,
        };
    });

    return <Animated.View style={[styles.container, style, animatedStyle]} />;
};

export default Skeleton;

const styles = StyleSheet.create({
    container: {
        borderRadius: 5,
    },
});
