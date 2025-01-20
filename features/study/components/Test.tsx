import { StyleSheet, View } from "react-native";
import React, { useState } from "react";
import Select, {
  SelectItemType,
} from "@/features/shared/components/input/Select";
import Accordion from "@/features/shared/components/layout/Accordion";

type Props = {};

const Test = (props: Props) => {
  return (
    <View
      style={{
        height: "100%",
        display: "flex",
        justifyContent: "space-around",
        alignItems: "center",
      }}
    >
      <Accordion />
    </View>
  );
};

export default Test;

const styles = StyleSheet.create({});
