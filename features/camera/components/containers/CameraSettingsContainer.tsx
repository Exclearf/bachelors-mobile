import React from "react";
import { StyleSheet, View } from "react-native";

import ToggleGroup from "@/features/shared/components/input/ToggleGroup";
import log from "@/features/shared/utils/log";

const items = [
  {
    id: "1",
    title: "Item 1",
  },
  {
    id: "2",
    title: "Item 2",
  },
  {
    id: "3",
    title: "Item 3",
  },
];

const CameraSettingsContainer = () => {
  const [switchChecked, setSwitchChecked] = React.useState(false);

  return (
    <View>
      <ToggleGroup
        width={300}
        height={30}
        selectedIndex={0}
        items={items}
        onChange={(e) => log.debug(e.id)}
      />
    </View>
  );
};

export default CameraSettingsContainer;

const styles = StyleSheet.create({});
