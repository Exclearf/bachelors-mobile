import { Canvas, Path, RoundedRect } from "@shopify/react-native-skia";
import React, { useState } from "react";
import { LayoutChangeEvent, StyleSheet, View } from "react-native";
import { ViewStyle } from "react-native/Libraries/StyleSheet/StyleSheetTypes";
import { useSharedValue } from "react-native-reanimated";

import { useBottomSheet } from "@/features/shared/hooks/useBottomSheet";

import { usePersonalizationStore } from "../../../settings/stores/personalizationStore";
import { useAppDimensions } from "../../hooks/useAppDimensions";
import { useIsFullScreenRoute } from "../../hooks/useIsFullScreenRoute";
import { useSkiaPath, UseSkiaPathProps } from "../../hooks/useSkiaPath";

type Props = {
  barHeight: number;
  minPathCreator: UseSkiaPathProps["minPathCreator"];
  maxPathCreator: UseSkiaPathProps["maxPathCreator"];
  zIndex: number;
  style?: ViewStyle;
  handleColor?: string;
  handlePadColorOverride?: string;
};

const AppRoundedPath = ({
  minPathCreator,
  maxPathCreator,
  barHeight,
  zIndex,
  style,
  handlePadColorOverride,
}: Props) => {
  const [parentWidth, setParentWidth] = useState(0);
  const { bottomSheet } = useBottomSheet();
  const isFullScreenRoute = useIsFullScreenRoute();

  let handlePadColor = usePersonalizationStore(
    (state) => state.theme,
  )?.secondaryForeground!;

  if (handlePadColorOverride) handlePadColor = handlePadColorOverride;

  //TODO: Workaround
  const sharedValue = useSharedValue(0);

  const onLayout = (event: LayoutChangeEvent) => {
    const newWidth = event.nativeEvent.layout.width;
    if (newWidth !== parentWidth) {
      setParentWidth(newWidth);
    }
  };

  const theme = usePersonalizationStore((state) => state.theme);

  const { width } = useAppDimensions();

  const animatedPosition = bottomSheet?.animatedPosition ?? sharedValue;

  const skiaPath = useSkiaPath({
    animatedPosition: animatedPosition,
    height: barHeight,
    minPathCreator,
    maxPathCreator,
  });

  const scaleX = parentWidth ? parentWidth / 100 : 1;

  const containerStyle = {
    ...styles.container,
    width,
    zIndex,
  };

  return (
    <View style={[containerStyle, style]} onLayout={onLayout}>
      <Canvas
        style={{
          width: parentWidth,
          height: barHeight,
          marginTop: 10,
        }}
      >
        <Path path={skiaPath} color={theme?.background} />
        {!isFullScreenRoute && (
          <RoundedRect
            transform={[{ scaleX }]}
            x={43}
            y={4}
            width={14}
            height={4}
            r={1}
            color={handlePadColor}
          />
        )}
      </Canvas>
    </View>
  );
};

export default AppRoundedPath;

const styles = StyleSheet.create({
  container: {
    top: 1,
    marginTop: -1,
    backgroundColor: "rgba(0,0,0,0)",
  },
});
