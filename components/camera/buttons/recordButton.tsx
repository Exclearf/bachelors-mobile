import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

type Props = {
  color: string;
  size: number;
};

const RecordButton = ({ size, color }: Props) => {
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
