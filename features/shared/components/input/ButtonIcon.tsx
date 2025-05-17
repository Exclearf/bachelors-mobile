import React from "react";
import { TouchableOpacity } from "react-native";

type ButtonIconProps = {
  IconComponent: React.JSX.Element;
  onPress?: () => void;
};

const ButtonIcon = ({ IconComponent, onPress }: ButtonIconProps) => {
  return <TouchableOpacity onPress={onPress}>{IconComponent}</TouchableOpacity>;
};

export default ButtonIcon;
