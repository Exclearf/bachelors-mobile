import { StyleSheet, ViewStyle } from "react-native";
import React from "react";
import SelectionGroupItem from "./SelectionGroupItem";
import Animated from "react-native-reanimated";
import { useTranslationStore } from "@/features/translation/stores/translationStore";
import { useShallow } from "zustand/react/shallow";
import { useCameraOptionsStore } from "@/features/camera/stores/cameraOptions";
import { useTheme } from "@/features/shared/hooks/useTheme";

export type SelectionGroupItemConfig = {
  id: "signToText" | "textToSign";
  translationKey: string;
  onClick: () => void;
  icon: (props: any) => React.ReactNode;
};

type Props = {
  items: SelectionGroupItemConfig[];
  containerHeight: number;
};

const SelectGroup = ({ items, containerHeight }: Props) => {
  const [mode, setMode] = useTranslationStore(
    useShallow((state) => [state.mode, state.setMode]),
  );
  const setIsAvailable = useCameraOptionsStore((state) => state.setIsAvailable);
  const theme = useTheme();

  // TODO: Workaround
  //@ts-expect-error
  styles.item = StyleSheet.compose(styles.item, {
    borderColor: theme?.mutedForeground,
    backgroundColor: theme?.mutedBackground,
  });

  return (
    <Animated.View style={[styles.container, { height: containerHeight }]}>
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
              color={
                item.id === mode
                  ? theme?.primaryForeground
                  : theme?.mutedForeground
              }
              size={17}
            />
          }
          itemStyle={
            item.id === mode
              ? (StyleSheet.compose(itemChosen as ViewStyle, {
                  backgroundColor: theme?.primaryBackground,
                  borderColor: theme?.primaryForeground,
                }) as ViewStyle)
              : styles.item
          }
          textStyle={
            item.id === mode
              ? StyleSheet.compose(styles.itemChosen, {
                  color: theme?.primaryForeground,
                })
              : StyleSheet.compose(styles.itemText, {
                  color: theme?.mutedForeground,
                })
          }
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
  },
  itemText: {
    fontSize: 15,
  },
  itemTextChosen: {
    fontSize: 15,
    fontWeight: "bold",
  },
});

const itemChosen = StyleSheet.compose(styles.item, styles.itemChosen);
