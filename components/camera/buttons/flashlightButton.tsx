import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import Entypo from "@expo/vector-icons/Entypo";

type Props = {
  color: string;
  size: number;
};

const FlashlightButton = ({ color, size }: Props) => {
  return (
    <TouchableOpacity>
      <Entypo name="flash" size={size} color={color} />
    </TouchableOpacity>
  );
};

export default FlashlightButton;

const styles = StyleSheet.create({});
