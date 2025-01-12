import { LayoutChangeEvent, StyleSheet, View } from "react-native";
import React, { useCallback, useContext, useMemo, useState } from "react";
import { useSharedValue } from "react-native-reanimated";
import { Canvas, Path, RoundedRect } from "@shopify/react-native-skia";
import { useBottomSheet } from "@/features/shared/hooks/useBottomSheet";
import { useSkiaPath } from "../../utils/roundedPathCreators";
import { AppDimensionsContext } from "../../contexts/appDimensions";
import { usePersonalizationStore } from "../../stores/personalizationStore";

type Props = {
  barHeight: number;
  pathCreator: (borderRadius: number) => string;
  zIndex: number;
  style?: any;
  handleColor?: string;
  handlePadColor?: string;
};

const AppRoundedPath = ({
  pathCreator,
  barHeight,
  zIndex,
  style,
  handlePadColor = "rgba(255,255,255,0.5)",
}: Props) => {
  const [parentWidth, setParentWidth] = useState(0);
  const { bottomSheet } = useBottomSheet();

  //TODO: Workaround
  const sharedValue = useSharedValue(0);

  const onLayout = useCallback(
    (event: LayoutChangeEvent) => {
      const newWidth = event.nativeEvent.layout.width;
      if (newWidth !== parentWidth) {
        setParentWidth(newWidth);
      }
    },
    [parentWidth],
  );

  const theme = usePersonalizationStore((state) => state.theme);

  const { height, width } = useContext(AppDimensionsContext);
  const skiaPath = useSkiaPath({
    animatedPosition: bottomSheet?.animatedPosition ?? sharedValue,
    height,
    pathCreator,
  });
  const scaleX = useMemo(
    () => (parentWidth ? parentWidth / 100 : 1),
    [parentWidth],
  );
  const containerStyle = useMemo(
    () => ({
      ...styles.container,
      width,
      zIndex,
    }),
    [width, barHeight, zIndex],
  );
  return (
    <View style={[containerStyle, style]} onLayout={onLayout}>
      <Canvas
        style={{
          width: parentWidth,
          height: barHeight,
          marginTop: 10,
          backgroundColor: "rgba(0,0,0,0)",
        }}
      >
        <Path
          transform={[{ scaleX }]}
          path={skiaPath}
          color={theme?.background}
        />
        <RoundedRect
          transform={[{ scaleX }]}
          x={43}
          y={4}
          width={14}
          height={4}
          r={1}
          color={handlePadColor}
        />
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
