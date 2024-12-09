import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

type Props = {
  color: string;
  size: number;
};

const GalleryButton = ({ color, size }: Props) => {
  return (
    <TouchableOpacity>
      <MaterialIcons name="photo-library" size={size} color={color} />
    </TouchableOpacity>
  );
};

export default GalleryButton;

const styles = StyleSheet.create({});
