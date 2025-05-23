import React, { useRef } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import Animated, {
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";

import { useFontSize } from "../../hooks/useFontSize";
import { useTheme } from "../../hooks/useTheme";
import Expandable, { ExpandableRef } from "../layout/Expandable";
import ExpandArrow from "../primitive/ExpandArrow";
import TranslatedText from "../text/TranslatedText";

export type SelectItemType = {
  id: string | number;
  translationKey: string;
  isPlaceholder?: boolean;
};

type Props = {
  items: SelectItemType[];
  currentItem: SelectItemType | null;
  setCurrentItem: (item: SelectItemType) => any;
  width?: number;
};

type SelectItemProps = {
  onPress: () => any;
  isActive: boolean;
  translationKey: string;
} & Partial<SelectItemType>;

type SelectPickerProps = {
  translationKey: string;
  width: number;
  maxHeight: number;
  expanded: SharedValue<number>;
};

const SelectPicker = ({
  translationKey,
  width,
  maxHeight,
  expanded,
}: SelectPickerProps) => {
  const theme = useTheme();
  const fontSize = useFontSize();
  return (
    <View
      style={[
        {
          backgroundColor: theme?.mutedBackground,
          borderColor: theme?.mutedForeground,
          width,
          paddingHorizontal: fontSize["regular"] / 2,
          paddingVertical: fontSize["regular"] / 4,
        },
        styles.pickerContainer,
      ]}
    >
      <TranslatedText
        translationKey={translationKey}
        style={[styles.contentText, { color: theme?.primaryForeground }]}
      />
      <ExpandArrow maxHeight={maxHeight} expanded={expanded} />
    </View>
  );
};

const SelectItem = ({ translationKey, isActive, onPress }: SelectItemProps) => {
  const theme = useTheme();

  return (
    <Pressable onPress={onPress} style={{ width: "100%" }}>
      <TranslatedText
        isBold={isActive}
        fontSize={"regular"}
        isSecondary={!isActive}
        translationKey={translationKey}
        style={{
          height: "100%",
          borderWidth: 0,
          backgroundColor: isActive ? theme?.mutedForeground : "transparent",
        }}
      />
    </Pressable>
  );
};

const Select = ({ items, setCurrentItem, currentItem, width }: Props) => {
  const expanded = useSharedValue(0);
  const theme = useTheme();
  const fontSize = useFontSize();
  const expandableRef = useRef<ExpandableRef>(null);
  const validItems = items.filter((item) => !item.isPlaceholder);

  width ??=
    (items.sort((a, b) => a.translationKey.length - b.translationKey.length)[0]
      .translationKey.length +
      2) *
      fontSize["regular"] +
    30;

  currentItem ??= items.find((item) => item.isPlaceholder)!;

  const animatedContentStyle = useAnimatedStyle(() => {
    "worklet";
    return { borderWidth: expanded.get() === 0 ? 0 : 1 };
  });

  const maxHeight = 4 + validItems.length * fontSize["regular"] * 2;

  return (
    <Expandable ref={expandableRef} expanded={expanded} height={maxHeight}>
      <Expandable.Trigger style={{ flexDirection: "row" }}>
        <SelectPicker
          expanded={expanded}
          maxHeight={maxHeight}
          translationKey={currentItem.translationKey}
          width={width}
        />
      </Expandable.Trigger>
      <Expandable.Content
        isAbsolute={true}
        style={[styles.containerWrapper, animatedContentStyle]}
        padding={5}
      >
        <Animated.View
          style={[
            styles.contentContainer,
            animatedContentStyle,
            {
              borderColor: theme?.mutedForeground,
              backgroundColor: theme?.mutedBackground,
            },
          ]}
        >
          {items.map((item) => {
            if (item.isPlaceholder) return null;

            return (
              <View
                key={item.id}
                style={[
                  {
                    overflow: "hidden",
                    alignItems: "center",
                    height: fontSize["regular"] * 2,
                  },
                ]}
              >
                <SelectItem
                  onPress={() => {
                    expandableRef.current?.close();
                    setCurrentItem(item);
                  }}
                  isActive={currentItem.id === item.id}
                  translationKey={item.translationKey}
                />
              </View>
            );
          })}
        </Animated.View>
      </Expandable.Content>
    </Expandable>
  );
};

export default Select;

const styles = StyleSheet.create({
  pickerContainer: {
    borderWidth: 1,
    borderRadius: 5,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  contentContainer: {
    height: "100%",
    width: "100%",
    position: "absolute",
    borderRadius: 5,
    justifyContent: "space-around",
    overflow: "hidden",
  },
  containerWrapper: {
    borderRadius: 5,
    borderWidth: 1,
    zIndex: 10,
  },
  contentText: {
    flex: 1,
    textAlign: "center",
  },
});
