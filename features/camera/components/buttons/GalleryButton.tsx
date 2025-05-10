import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React from "react";
import { TouchableOpacity } from "react-native";

import { CameraOverlayButtonProps } from "../../CameraOverlay";

const GalleryButton = ({ color, size, onClick }: CameraOverlayButtonProps) => {
  return (
    <TouchableOpacity onPress={onClick}>
      <MaterialIcons name="photo-library" size={size} color={color} />
    </TouchableOpacity>
  );
};

export default GalleryButton;
