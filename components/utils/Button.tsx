import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { PropsWithChildren } from "react";

type Props = {};

const Button = ({ children }: PropsWithChildren<Props>) => {
  return <TouchableOpacity>{children}</TouchableOpacity>;
};

export default Button;

const styles = StyleSheet.create({});
