import { StyleSheet, View } from "react-native";
import React from "react";

type Props = {};

const Test = (props: Props) => {
  return (
    <View
      style={{
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    ></View>
  );
};

export default Test;

const styles = StyleSheet.create({});
