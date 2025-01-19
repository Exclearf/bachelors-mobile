import { StyleSheet, View } from "react-native";
import React, { useState } from "react";
import Select, {
  SelectItemType,
} from "@/features/shared/components/input/Select";
import Accordion from "@/features/shared/components/layout/Accordion";

type Props = {};

const Test = (props: Props) => {
  const mockAccordionData: SelectItemType[] = [
    {
      id: 1,
      title: "Select 1",
    },
    {
      id: 2,
      title: "Select 2",
    },
    {
      id: 3,
      title: "Select 3",
    },
  ];

  const [currentItem, setCurrentItem] = useState(mockAccordionData[0]);

  return (
    <View
      style={{
        height: "100%",
        display: "flex",
        justifyContent: "space-around",
        alignItems: "center",
      }}
    >
      <Select
        items={mockAccordionData}
        currentItem={currentItem}
        setCurrentItem={setCurrentItem}
      />
      <Accordion />
    </View>
  );
};

export default Test;

const styles = StyleSheet.create({});
