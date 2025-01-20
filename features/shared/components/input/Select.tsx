import { Pressable, StyleSheet, View } from "react-native";
import React, { useRef } from "react";
import Expandable, { ExpandableRef } from "../layout/Expandable";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { useTheme } from "../../hooks/useTheme";
import { useFontSize } from "../../hooks/useFontSize";
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
};

const SelectPicker = ({ translationKey, width }: SelectPickerProps) => {
  const theme = useTheme();

  return (
    <View
      style={[
        {
          backgroundColor: theme?.mutedBackground,
          borderColor: theme?.mutedForeground,
          borderWidth: 1,
          width,
        },
        styles.pickerContainer,
      ]}
    >
      <TranslatedText
        translationKey={translationKey}
        style={{
          color: theme?.primaryForeground,
          textAlign: "center",
        }}
      />
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
  const expandableRef = useRef<ExpandableRef>();
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
    return {
      borderWidth: expanded.get() === 0 ? 0 : 1,
    };
  });

  return (
    <Expandable
      ref={expandableRef}
      expanded={expanded}
      height={4 + validItems.length * fontSize["regular"] * 2}
    >
      <Expandable.Trigger>
        <SelectPicker
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
    padding: 5,
    borderRadius: 5,
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
});
