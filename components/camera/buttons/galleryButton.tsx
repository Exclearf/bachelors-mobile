import { StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { CameraOverlayButtonProps } from "../cameraOverlay";

const GalleryButton = ({ color, size }: CameraOverlayButtonProps) => {
  return (
    <TouchableOpacity>
      <MaterialIcons name="photo-library" size={size} color={color} />
    </TouchableOpacity>
  );
};

export default GalleryButton;

const styles = StyleSheet.create({});
