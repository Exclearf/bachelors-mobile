import { StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { CameraOverlayButtonProps } from "../cameraOverlay";

const RecordButton = ({ size, color }: CameraOverlayButtonProps) => {
  return (
    <TouchableOpacity>
      <MaterialIcons
        name="fiber-manual-record"
        size={size * 2.5}
        color={color}
      />
    </TouchableOpacity>
  );
};

export default RecordButton;

const styles = StyleSheet.create({});
