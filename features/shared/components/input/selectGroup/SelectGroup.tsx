import { StyleSheet, ViewStyle } from "react-native";
import React, { useContext } from "react";
import SelectionGroupItem from "./SelectionGroupItem";
import Animated from "react-native-reanimated";
import { useTranslationStore } from "@/features/settings/stores/translationStore";
import { useShallow } from "zustand/react/shallow";
import { useCameraOptionsStore } from "@/features/camera/stores/cameraOptions";
import { AppDimensionsContext } from "@/features/shared/contexts/appDimensions";

export type SelectionGroupItemConfig = {
  id: "signToText" | "textToSign";
  translationKey: string;
  onClick: () => void;
  icon: (props: any) => React.ReactNode;
};

type Props = {
  items: SelectionGroupItemConfig[];
};

const SelectGroup = ({ items }: Props) => {
  const { height } = useContext(AppDimensionsContext);
  const [mode, setMode] = useTranslationStore(
    useShallow((state) => [state.mode, state.setMode]),
  );
  const setIsAvailable = useCameraOptionsStore((state) => state.setIsAvailable);

  return (
    <Animated.View style={[styles.container, { height: height * 0.1 - 30 }]}>
      {items?.map((item) => (
        <SelectionGroupItem
          key={item.id}
          onClick={() => {
            item.onClick();
            setIsAvailable(false);
            setMode(item.id);
            setTimeout(() => setIsAvailable(true), 500);
          }}
          translationKey={item.translationKey}
          Icon={
            <item.icon
              color={item.id === mode ? "#5289e3" : "white"}
              size={17}
            />
          }
          itemStyle={item.id === mode ? (itemChosen as ViewStyle) : styles.item}
          textStyle={item.id === mode ? styles.itemTextChosen : styles.itemText}
        />
      ))}
    </Animated.View>
  );
};

export default SelectGroup;

const styles = StyleSheet.create({
  container: {
    display: "flex",
    justifyContent: "space-evenly",
    alignItems: "center",
    flexDirection: "row",
    width: "100%",
  },
  item: {
    backgroundColor: "transparent",
    borderRadius: 20,
    paddingHorizontal: 30,
    paddingVertical: 7,
    borderColor: "grey",
    borderWidth: 1,
    height: 35,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  itemChosen: {
    borderColor: "rgba(100, 146, 222, 0.3)",
    color: "#5289e3",
    backgroundColor: "rgba(100, 146, 222, 0.3)",
  },
  itemText: {
    fontSize: 15,
    color: "white",
  },
  itemTextChosen: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#5c97f7",
  },
});

const itemChosen = StyleSheet.compose(styles.item, styles.itemChosen);
