import React, { PropsWithChildren, useContext, useRef } from "react";
import {
  Pressable,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import CollapseAnimated from "@/features/shared/components/primitive/CollapseAnimated";
import TranslatedText from "@/features/shared/components/text/TranslatedText";
import { AppDimensionsContext } from "@/features/shared/contexts/appDimensions";
import { useBottomSheet } from "@/features/shared/hooks/useBottomSheet";
import ClearTranslationButton from "@/features/translation/components/input/ClearTranslationButton";
import TextToVoiceButton from "@/features/translation/components/input/TextToVoiceButton";
import { useTranslationStore } from "@/features/translation/stores/useTranslationStore";

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
  const activeVideo = useTranslationStore(
    (state) => state.activeVideoTranslationResult,
  );

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
              height * 0.157 -
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
          isBold={true}
          fontSize="medium"
          style={expandableModalStyles.headerText}
          translationKey={titleTranslationKey}
        />
        <View
          style={[
            expandableModalStyles.customSectionStyle,
            { height: iconSize * 2 },
          ]}
        >
          {/* TODO: Extract into a prop! */}
          {mode === "signToText" && (
            <>
              {activeVideo && <ClearTranslationButton />}
              <TextToVoiceButton size={24} color="white" />
            </>
          )}
        </View>
        <Pressable
          onPress={() => {
            expansionFactor.set(withTiming(isExpanding.current ? 0 : 1));
            isExpanding.current = !isExpanding.current;
          }}
          style={{
            height: iconSize * 2,
            width: iconSize * 2,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <CollapseAnimated value={expansionFactor} color="white" size={24} />
        </Pressable>
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
  },
  customSectionStyle: {
    flex: 1,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 10,
  },
});
