import AntDesign from "@expo/vector-icons/AntDesign";
import React, { PropsWithChildren, useState } from "react";
import { DimensionValue, StyleSheet, View } from "react-native";

import Popup, { PopupVerticalPosition } from "./Popup";
import { useTheme } from "../../hooks/useTheme";

type Props = PropsWithChildren<{
  iconSize?: number;
  iconColor?: string;
  width?: number | string;
  height?: number | string;
  verticalPosition: PopupVerticalPosition;
}>;

const Tooltip = ({
  children,
  iconSize = 24,
  iconColor,
  width = 100,
  height = 50,
  verticalPosition = "top",
}: Props) => {
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);
  const theme = useTheme();

  return (
    <View style={{ position: "relative" }}>
      <Popup isOpen={isTooltipVisible} setIsOpen={setIsTooltipVisible}>
        <Popup.Trigger>
          <AntDesign
            name="questioncircleo"
            size={iconSize}
            color={iconColor ?? theme?.mutedForeground}
          />
        </Popup.Trigger>
        <Popup.Content
          verticalPosition={verticalPosition}
          width={width}
          height={height}
        >
          <View
            style={[
              styles.tooltipContent,
              {
                backgroundColor: theme?.primaryBackground,
                height: height as DimensionValue,
                width: width as DimensionValue,
                flexShrink: 1,
                borderColor: theme?.mutedForeground,
              },
            ]}
          >
            {children}
          </View>
        </Popup.Content>
      </Popup>
    </View>
  );
};

export default Tooltip;

const styles = StyleSheet.create({
  tooltipContent: {
    borderRadius: 5,
    padding: 10,
    borderWidth: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
});
