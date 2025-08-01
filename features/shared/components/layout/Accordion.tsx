import React, { PropsWithChildren, useRef } from "react";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import Animated, {
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
} from "react-native-reanimated";

import { useFontSize } from "../../hooks/useFontSize";
import { useTheme } from "../../hooks/useTheme";
import Expandable, { ExpandableRef } from "../layout/Expandable";
import ExpandArrow from "../primitive/ExpandArrow";
import TranslatedText from "../text/TranslatedText";

type AccordionProps = PropsWithChildren<{
  translationKey: string;
  maxHeight: number;
  style?: StyleProp<ViewStyle>;
}>;

// TODO: Fix the bottom border not being shown, possible reqrite the underlying Expandable component
const Accordion = ({
  maxHeight = 200,
  translationKey,
  children,
  style,
}: AccordionProps) => {
  const expanded = useSharedValue(0);
  const borderRadius = 5;
  const fontSize = useFontSize();
  const expandableRef = useRef<ExpandableRef>(null);
  const theme = useTheme();

  const borderRadiusDerived = useDerivedValue(() => {
    return (1 - expanded.get() / maxHeight) * borderRadius;
  });

  const animatedBorderRadius = useAnimatedStyle(() => {
    return {
      borderBottomLeftRadius: borderRadiusDerived.get(),
      borderBottomRightRadius: borderRadiusDerived.get(),
    };
  });

  return (
    <Expandable ref={expandableRef} expanded={expanded} height={maxHeight}>
      <Expandable.Trigger style={style}>
        <Animated.View
          style={[
            {
              paddingHorizontal: fontSize["regular"] / 2,
              gap: fontSize["regular"],
              paddingVertical: fontSize["regular"] / 4,
            },
            styles.triggerContainer,
            {
              borderColor: theme?.mutedForeground,
              borderWidth: 1,
              borderTopLeftRadius: borderRadius,
              borderTopRightRadius: borderRadius,
            },
            animatedBorderRadius,
          ]}
        >
          <TranslatedText
            translationKey={translationKey}
            style={styles.triggerText}
          />
          <ExpandArrow maxHeight={maxHeight} expanded={expanded} />
        </Animated.View>
      </Expandable.Trigger>
      <Expandable.Content isAbsolute={false} padding={-2}>
        <View
          style={[
            {
              height: maxHeight,
              borderWidth: 1,
              position: "relative",
              borderTopColor: theme?.background,
              borderLeftColor: theme?.mutedForeground,
              borderRightColor: theme?.mutedForeground,
              borderBottomColor: theme?.mutedForeground,
              borderBottomLeftRadius: borderRadius,
              borderBottomRightRadius: borderRadius,
              backgroundColor: theme?.background,
            },
            styles.contentContent,
          ]}
        >
          <View
            style={{
              position: "absolute",
              top: -1,
              left: -1,
              width: 1,
              height: 1,
              borderColor: theme?.mutedForeground,
              backgroundColor: theme?.mutedForeground,
            }}
          />
          {children}
        </View>
      </Expandable.Content>
    </Expandable>
  );
};

export default Accordion;

const styles = StyleSheet.create({
  triggerContainer: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
  },
  triggerText: {
    textDecorationLine: "underline",
    textDecorationStyle: "double",
  },
  contentContent: {
    position: "absolute",
    width: "100%",
  },
});
