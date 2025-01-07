import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import React, { PropsWithChildren, useContext, useRef } from "react";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import { AppDimensionsContext } from "@/contexts/appDimensions";
import { useBottomSheet } from "@/hooks/useBottomSheet";
import CollapseAnimated from "../common/CollapseAnimated";
import { useTranslationStore } from "@/stores/translationStore";
import TextToVoiceButton from "../../screens/index/components/buttons/TextToVoiceButton";
import TranslatedText from "../common/TranslatedText";

type Props = PropsWithChildren<{
  initialHeight: number;
  padding: number;
  titleTranslationKey: string;
  containerStyle: StyleProp<ViewStyle>[];
}>;

const ExpandableModal = ({
  containerStyle,
  initialHeight,
  padding,
  titleTranslationKey,
  children,
}: Props) => {
  const expansionFactor = useSharedValue(0);
  const iconSize = 24;
  const isExpanding = useRef(false);
  const { height, width } = useContext(AppDimensionsContext);
  const { bottomSheet } = useBottomSheet();
  const mode = useTranslationStore((state) => state.mode);

  const animateStyle = useAnimatedStyle(() => {
    return {
      top: interpolate(expansionFactor.get(), [0, 1], [padding, padding / 2]),
      position: "absolute",
      zIndex: 10,
      width: interpolate(
        expansionFactor.get(),
        [0, 1],
        [width - padding * 2, width - padding],
      ),
      height: interpolate(
        expansionFactor.get(),
        [0, 1],
        [
          initialHeight,
          Math.max(
            height * 0.55 - height * 0.11 - 36,
            height -
              (bottomSheet?.animatedPosition.get() ?? 0) -
              height * 0.2 -
              padding / 2,
          ),
        ],
      ),
    };
  });

  return (
    <Animated.View style={[...containerStyle, animateStyle]}>
      <View style={expandableModalStyles.header}>
        <TranslatedText
          style={expandableModalStyles.headerText}
          translationKey={titleTranslationKey}
        />
        <View
          style={{
            width: iconSize * 4,
            height: iconSize * 2,
          }}
        >
          {mode === "signToText" && (
            <TextToVoiceButton size={24} color="white" />
          )}
          <TouchableWithoutFeedback
            onPress={() => {
              expansionFactor.set(withTiming(isExpanding.current ? 0 : 1));
              isExpanding.current = !isExpanding.current;
            }}
            style={{
              position: "absolute",
              right: 0,
              top: 0,
              height: iconSize * 2,
              width: iconSize * 2,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <CollapseAnimated value={expansionFactor} color="white" size={24} />
          </TouchableWithoutFeedback>
        </View>
      </View>
      {children}
    </Animated.View>
  );
};

export default ExpandableModal;

export const expandableModalStyles = StyleSheet.create({
  header: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerText: {
    marginVertical: 10,
    marginHorizontal: 15,
    color: "white",
    fontSize: 20,
    fontWeight: 400,
  },
});
