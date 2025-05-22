import React, { PropsWithChildren, useMemo } from "react";
import { StyleSheet, TouchableOpacity, ViewStyle } from "react-native";

import { useTheme } from "../../hooks/useTheme";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "destructive"
  | "transparent";

type ButtonProps = {
  onPress?: () => any;
  width?: number;
  height?: number;
  padding?: number;
  style?: ViewStyle;
  variant?: ButtonVariant;
};

const Button = ({
  children,
  onPress,
  width,
  height,
  padding,
  style,
  variant = "primary",
}: PropsWithChildren<ButtonProps>) => {
  const theme = useTheme();

  const backgroundColorPallete = useMemo<
    Record<ButtonVariant, string | undefined>
  >(
    () => ({
      primary: theme?.mutedForeground,
      secondary: theme?.mutedBackground,
      destructive: theme?.destructive,
      transparent: "",
    }),
    [theme],
  );

  return (
    <TouchableOpacity
      onPress={() => {
        onPress?.();
      }}
      style={[
        styles.container,
        {
          backgroundColor: backgroundColorPallete[variant],
          borderColor: theme?.mutedForeground,
          width,
          height,
          padding,
        },
        style,
      ]}
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
    justifyContent: "center",
    alignItems: "center",
  },
});
