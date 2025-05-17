import React, { PropsWithChildren } from "react";
import { StyleSheet, TouchableOpacity, ViewStyle } from "react-native";

import { useTheme } from "../../hooks/useTheme";

type Props = {
  onPress?: () => any;
  width?: number;
  height?: number;
  padding?: number;
  style?: ViewStyle;
};

const Button = ({
  children,
  onPress,
  width,
  height,
  padding,
  style,
}: PropsWithChildren<Props>) => {
  const theme = useTheme();

  return (
    <TouchableOpacity
      onPress={() => {
        onPress?.();
      }}
      style={[
        styles.container,
        {
          backgroundColor: theme?.secondaryBackground,
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
