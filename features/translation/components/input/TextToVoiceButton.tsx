import Feather from "@expo/vector-icons/Feather";
import React from "react";
import { StyleSheet } from "react-native";

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
      style={{
        padding: size / 2,
        width: size * 2,
      }}
    />
  );
};

export default TextToVoiceButton;

const styles = StyleSheet.create({});
