import { StyleSheet, TouchableOpacity, ViewStyle } from "react-native";
import React, { PropsWithChildren } from "react";

type Props = {
    onPress?: () => any;
    width: number;
    height: number;
    backgroundColor: string;
    style?: ViewStyle;
};

const Button = ({
    children,
    onPress,
    backgroundColor,
    width,
    height,
    style,
}: PropsWithChildren<Props>) => {
    return (
        <TouchableOpacity
            onPress={() => {
                console.log("Button clicked");
                onPress?.();
            }}
            style={[styles.container, { backgroundColor, width, height }, style]}
        >
            {children}
        </TouchableOpacity>
    );
};

export default Button;

const styles = StyleSheet.create({
    container: {
        borderRadius: 10,
        padding: 10,
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.2)",
        justifyContent: "center",
        alignItems: "center",
    },
});
