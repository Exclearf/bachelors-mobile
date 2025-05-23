import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React from "react";
import { TouchableOpacity } from "react-native";

import { CameraOverlayButtonProps } from "../../CameraOverlay";

const RecordButton = ({ size, color, onClick }: CameraOverlayButtonProps) => {
  return (
    <TouchableOpacity onPress={onClick}>
      <MaterialIcons
        name="fiber-manual-record"
        size={size * 2.5}
        color={color}
      />
    </TouchableOpacity>
  );
};

export default RecordButton;
