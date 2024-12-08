import { LayoutChangeEvent, StyleSheet, Text, View } from "react-native";
import React, { useContext, useState } from "react";
import { SharedValue, useDerivedValue } from "react-native-reanimated";
import { Canvas, Path, RoundedRect, Skia } from "@shopify/react-native-skia";
import { AppDimensionsContext } from "@/contexts/appDimensions";
import { useSkiaPath } from "@/utils/roundedPathCreators";

type Props = {
  barHeight: number;
  animatedPosition: SharedValue<number>;
  pathCreator: (borderRadius: number) => string;
  zIndex: number;
  handleColor?: string;
  handlePadColor?: string;
};

const AppRoundedPath = ({
  animatedPosition,
  pathCreator,
  barHeight,
  zIndex,
  handleColor = "#1E1E1E",
  handlePadColor = "#E2E2E2",
}: Props) => {
  const [parentWidth, setParentWidth] = useState(0);

  const onLayout = (event: LayoutChangeEvent) => {
    const newWidth = event.nativeEvent.layout.width;
    if (newWidth !== parentWidth) {
      setParentWidth(newWidth);
    }
  };

  const { height, width } = useContext(AppDimensionsContext);
  const skiaPath = useSkiaPath({ animatedPosition, height, pathCreator });
  return (
    <View
      style={{ ...styles.container, width, height: barHeight, zIndex }}
      onLayout={onLayout}
    >
      <Canvas
        style={{
          width: parentWidth,
          height: barHeight,
          backgroundColor: "rgba(0,0,0,0)",
        }}
      >
        <Path
          transform={[{ scaleX: parentWidth / 100 }]}
          path={skiaPath}
          color={handleColor}
        />
        <RoundedRect
          transform={[{ scaleX: parentWidth / 100 }]}
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
