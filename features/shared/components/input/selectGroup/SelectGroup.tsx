import React from "react";
import { StyleSheet, ViewStyle } from "react-native";
import Animated from "react-native-reanimated";
import { useShallow } from "zustand/react/shallow";

import { useCameraOptionsStore } from "@/features/camera/stores/useCameraOptionsStore";
import { useFontSize } from "@/features/shared/hooks/useFontSize";
import { useTheme } from "@/features/shared/hooks/useTheme";
import { globalTheme } from "@/features/shared/utils/themes";
import { useTranslationStore } from "@/features/translation/stores/useTranslationStore";

import SelectionGroupItem from "./SelectGroundItem";

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
  const fontSize = useFontSize();

  // TODO: Workaround
  //@ts-expect-error
  styles.item = StyleSheet.compose(styles.item, {
    borderColor: theme?.surfaceForeground,
    backgroundColor: theme?.secondaryBackground,
  });

  const baseFontStyle = {
    color: theme?.primaryForeground,
    flex: 1,
    textAlign: "left" as const,
    fontSize: fontSize?.regular,
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          height: containerHeight,
          position: "relative",
        },
      ]}
    >
      {items?.map((item) => (
        <SelectionGroupItem
          key={item.id}
          onClick={() => {
            if (mode === item.id) return;

            item.onClick();
            setIsAvailable(false);
            setMode(item.id);
            setTimeout(() => setIsAvailable(true), 100);
          }}
          translationKey={item.translationKey}
          Icon={
            <item.icon
              style={styles.iconStyle}
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
                  backgroundColor: theme?.mutedBackground,
                  borderColor: theme?.primaryForeground,
                }) as ViewStyle)
              : styles.item
          }
          textStyle={
            item.id === mode
              ? StyleSheet.compose(styles.itemChosen, baseFontStyle)
              : StyleSheet.compose(baseFontStyle, {
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
  itemContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
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
    width: "33%",
    paddingHorizontal: 10,
    borderColor: "grey",
    borderWidth: 1,
    height: 35,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  itemChosen: {
    fontFamily: globalTheme.fontSemiBold,
    borderColor: "rgba(100, 146, 222, 0.3)",
  },
  iconStyle: {
    flex: 1,
    textAlign: "center",
  },
});

const itemChosen = StyleSheet.compose(styles.item, styles.itemChosen);
