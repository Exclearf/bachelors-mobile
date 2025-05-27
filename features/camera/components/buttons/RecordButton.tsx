import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import React from "react";
import { TouchableOpacity } from "react-native";

import { CameraOverlayButtonProps } from "../../CameraOverlay";

const RecordButton = ({
  size,
  color,
  onClick,
  iconName = "record-circle",
}: CameraOverlayButtonProps) => {
  return (
    <TouchableOpacity onPress={onClick}>
      {/* TODO:
       *  Add correct type anoatation
       */}
      <MaterialCommunityIcons
        name={iconName as any}
        size={size * 2}
        color={color}
        style={{ paddingBottom: 10 }}
      />
    </TouchableOpacity>
  );
};

export default RecordButton;
