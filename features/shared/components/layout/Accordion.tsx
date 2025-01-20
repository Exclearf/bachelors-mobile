import { StyleSheet, View } from "react-native";
import React, { PropsWithChildren, useRef } from "react";
import Animated, {
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
} from "react-native-reanimated";
import Expandable, { ExpandableRef } from "../layout/Expandable";
import TranslatedText from "../text/TranslatedText";
import {
  Canvas,
  Path,
  Skia,
  usePathInterpolation,
} from "@shopify/react-native-skia";
import { useFontSize } from "../../hooks/useFontSize";
import { useTheme } from "../../hooks/useTheme";

type AccordionProps = PropsWithChildren<{
  translationKey: string;
  maxHeight: number;
}>;

const createOpenArrow = (height: number) => `
  M 2 ${height / 3}
  L ${height / 2} ${height - 2 - height / 6}
  L ${height - 2} ${height / 3}`;

const createCloseArrow = (height: number) => `
  M 2 ${(height * 2) / 3}
  L ${height / 2} ${height / 6 + 2}
  L ${height - 2} ${height - height / 3}
`;

const createSkiaPath = (
  creator: typeof createCloseArrow | typeof createOpenArrow,
  ...args: any
) => Skia.Path.MakeFromSVGString(creator.apply(null, args as any))!;

const Accordion = ({
  maxHeight = 200,
  translationKey,
  children,
}: AccordionProps) => {
  const expanded = useSharedValue(0);
  const borderRadius = 5;
  const fontSize = useFontSize();
  const arrowDimensions = fontSize["regular"] * 1.25;
  const expandableRef = useRef<ExpandableRef>();
  const theme = useTheme();

  const arrowPath = usePathInterpolation(
    expanded,
    [0, maxHeight],
    [
      createSkiaPath(createOpenArrow, arrowDimensions),
      createSkiaPath(createCloseArrow, arrowDimensions),
    ],
  );

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
      <Expandable.Trigger>
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
          <View style={styles.contentContainer}>
            <Canvas
              style={{
                width: arrowDimensions,
                height: arrowDimensions,
              }}
            >
              <Path
                path={arrowPath}
                style={"stroke"}
                strokeWidth={2}
                color={"white"}
                strokeCap={"round"}
              />
            </Canvas>
          </View>
        </Animated.View>
      </Expandable.Trigger>
      <Expandable.Content isAbsolute={false} padding={-2}>
        <View
          style={[
            {
              height: maxHeight,
              borderWidth: 1,
              position: "relative",
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
  contentContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  contentContent: {
    position: "absolute",
    width: "100%",
  },
});
