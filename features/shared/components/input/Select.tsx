import { Pressable, StyleSheet, View } from "react-native";
import React, { Dispatch, SetStateAction, useRef } from "react";
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
  title: string;
};

type Props = {
  items: SelectItemType[];
  currentItem: SelectItemType;
  setCurrentItem: Dispatch<SetStateAction<SelectItemType>>;
};

type SelectItemProps = {
  onPress: () => any;
} & Partial<SelectItemType>;

type SelectPickerProps = {
  title: string;
};

const SelectPicker = ({ title }: SelectPickerProps) => {
  const theme = useTheme();

  return (
    <View
      style={[
        {
          backgroundColor: theme?.primaryBackground,
          borderColor: theme?.mutedForeground,
          borderWidth: 1,
        },
        styles.pickerContainer,
      ]}
    >
      <TranslatedText
        translationKey={title}
        style={{ color: theme?.primaryForeground, textAlign: "center" }}
      ></TranslatedText>
    </View>
  );
};

const SelectItem = ({ title, onPress }: SelectItemProps) => {
  const themes = useTheme();

  return (
    <Pressable onPress={onPress}>
      <TranslatedText
        translationKey={title!}
        style={{
          textAlign: "center",
          color: themes?.primaryForeground,
          width: "100%",
        }}
      />
    </Pressable>
  );
};

const Select = ({ items, setCurrentItem, currentItem }: Props) => {
  const expanded = useSharedValue(0);
  const theme = useTheme();
  const fontSize = useFontSize();
  const expandableRef = useRef<ExpandableRef>();

  const animatedContentStyle = useAnimatedStyle(() => {
    return {
      borderColor: theme?.mutedForeground,
      backgroundColor: theme?.mutedBackground,
      borderWidth: expanded.get() === 0 ? 0 : 1,
    };
  });

  return (
    <Expandable
      ref={expandableRef}
      expanded={expanded}
      height={(items.length + 2) * fontSize["regular"]}
    >
      <Expandable.Trigger>
        <SelectPicker title={currentItem.title} />
      </Expandable.Trigger>
      <Expandable.Content
        isAbsolute={true}
        style={[animatedContentStyle, styles.containerWrapper]}
        padding={5}
      >
        <Animated.View style={styles.contentContainer}>
          {items.map((item) => (
            <SelectItem
              onPress={() => {
                expandableRef.current?.close();
                setCurrentItem(item);
              }}
              title={item.title}
              key={item.id}
            />
          ))}
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
    justifyContent: "space-evenly",
  },
  containerWrapper: {
    borderRadius: 5,
  },
});
