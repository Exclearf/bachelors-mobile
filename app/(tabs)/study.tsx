import { StyleSheet, Text, View } from "react-native";
import React from "react";
import StudyScreen from "@/screens/study/StudyScreen";

type Props = {};

const StudyTab = (props: Props) => {
  return (
    <View style={{ flex: 1, backgroundColor: "#1e1e1e" }}>
      <StudyScreen />
    </View>
  );
};

export default StudyTab;

const styles = StyleSheet.create({});
