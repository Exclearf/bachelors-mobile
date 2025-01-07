import { TouchableOpacity } from "react-native";
import React from "react";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
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
