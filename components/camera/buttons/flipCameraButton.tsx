import { StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

type Props = {
  color: string;
  size: number;
};

const FlipCameraButton = ({ color, size }: Props) => {
  return (
    <TouchableOpacity>
      <MaterialIcons name="flip-camera-android" size={size} color={color} />
    </TouchableOpacity>
  );
};

export default FlipCameraButton;

const styles = StyleSheet.create({});
