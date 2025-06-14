import React from "react";
import { Pressable } from "react-native";

type ButtonIconProps = {
  IconComponent: React.JSX.Element;
  onPress?: () => void;
};

const ButtonIcon = ({ IconComponent, onPress }: ButtonIconProps) => {
  return <Pressable onPress={onPress}>{IconComponent}</Pressable>;
};

export default ButtonIcon;
