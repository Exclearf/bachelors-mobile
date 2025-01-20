import { StyleSheet } from "react-native";
import React from "react";
import { useSharedValue } from "react-native-reanimated";
import Expandable from "../layout/Expandable";

type AccordionProps = {};

const Accordion = (props: Props) => {
  const expanded = useSharedValue(0);

  return (
    <Expandable expanded={expanded} height={200}>
      <Expandable.Trigger />
      <Expandable.Content isAbsolute={false} />
    </Expandable>
  );
};

export default Accordion;

const styles = StyleSheet.create({});
