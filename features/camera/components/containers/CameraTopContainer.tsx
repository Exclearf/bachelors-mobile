import { StyleSheet } from "react-native";
import React from "react";
import Animated, {
    DerivedValue,
    useAnimatedStyle,
} from "react-native-reanimated";

type Props = React.PropsWithChildren<{
    scale: DerivedValue<number>;
}>;

const CameraTopContainer = ({ children, scale }: Props) => {
    const animStyle = useAnimatedStyle(() => {
        return {
            opacity: scale.get() * 2.31,
            top: 40 - scale.get() * 30,
        };
    });

    return (
        <Animated.View style={[styles.container, animStyle]}>
            {children}
        </Animated.View>
    );
};

export default CameraTopContainer;

const styles = StyleSheet.create({
    container: {
        zIndex: 1,
        width: "100%",
        position: "absolute",
        display: "flex",
        justifyContent: "space-between",
        paddingHorizontal: 15,
        alignItems: "center",
        flexDirection: "row",
    },
});
