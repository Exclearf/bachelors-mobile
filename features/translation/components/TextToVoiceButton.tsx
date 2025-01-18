import { StyleSheet } from "react-native";
import React from "react";
import Feather from "@expo/vector-icons/Feather";

type Props = {
  size: number;
  color: string;
};

const TextToVoiceButton = ({ size, color }: Props) => {
  return (
    <Feather
      name="volume-2"
      size={size}
      color={color}
      style={[styles.container, { padding: size / 2, width: size * 2 }]}
    />
  );
};

export default TextToVoiceButton;

const styles = StyleSheet.create({
  container: {
    position: "absolute",
  },
});
