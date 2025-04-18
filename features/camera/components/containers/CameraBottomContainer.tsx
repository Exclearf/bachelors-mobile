import { StyleSheet } from "react-native";
import React, { useContext } from "react";
import Animated, {
    DerivedValue,
    useAnimatedStyle,
} from "react-native-reanimated";
import { useBottomSheet } from "@/features/shared/hooks/useBottomSheet";
import { AppDimensionsContext } from "@/features/shared/contexts/appDimensions";

type Props = React.PropsWithChildren<{
    scale: DerivedValue<number>;
}>;

const CameraBottomContainer = ({ children, scale }: Props) => {
    const { bottomSheet } = useBottomSheet();
    const { height } = useContext(AppDimensionsContext);

    const bottomStyle = useAnimatedStyle(() => {
        "worklet";
        const newHeight = Math.min(
            height - (bottomSheet?.animatedPosition?.get() ?? 0) - 10,
            height * 0.53 - 10,
        );
        return {
            marginBottom: scale.get() * 24,
            bottom: newHeight,
        };
    });

    return (
        <Animated.View style={[bottomStyle, styles.container]}>
            {children}
        </Animated.View>
    );
};

export default CameraBottomContainer;

const styles = StyleSheet.create({
    container: {
        width: "100%",
        position: "absolute",
        display: "flex",
        justifyContent: "space-around",
        alignItems: "center",
        flexDirection: "row",
    },
});
