import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import Feather from "@expo/vector-icons/Feather";

type Props = {
  color: string;
  size: number;
};

const SettingsButton = ({ color, size }: Props) => {
  return (
    <TouchableOpacity>
      <Feather name="chevron-down" size={size} color={color} />
    </TouchableOpacity>
  );
};

export default SettingsButton;

const styles = StyleSheet.create({});
