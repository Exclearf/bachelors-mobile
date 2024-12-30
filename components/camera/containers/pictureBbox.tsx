import { StyleSheet, Text, View } from "react-native";
import React, { useContext } from "react";
import { Canvas, Group, Rect } from "@shopify/react-native-skia";
import { AppDimensionsContext } from "@/contexts/appDimensions";
import { useDerivedValue, useSharedValue } from "react-native-reanimated";

type Props = {};

const PictureBbox = (props: Props) => {
  const { width, height } = useContext(AppDimensionsContext);

  const topLeft = {
    x: useSharedValue(width * 0.1),
    y: useSharedValue(height * 0.2),
  };
  const topRight = {
    x: useSharedValue(width * 0.9),
    y: useSharedValue(height * 0.2),
  };
  const bottomRight = {
    x: useSharedValue(width * 0.9),
    y: useSharedValue(height * 0.7),
  };
  const bottomLeft = {
    x: useSharedValue(width * 0.1),
    y: useSharedValue(height * 0.7),
  };

  const cropPath = useDerivedValue(() => {
    return `
    M ${topLeft.x.value} ${topLeft.y.value}
    L ${topRight.x.value} ${topRight.y.value}
    L ${bottomRight.x.value} ${bottomRight.y.value}
    L ${bottomLeft.x.value} ${bottomLeft.y.value}
    Z
  `;
  });

  return (
    <Canvas style={styles.container}>
      <Group clip={cropPath} invertClip>
        <Rect
          x={0}
          y={0}
          width={width}
          height={height}
          color="rgba(75,75,75,0.85)"
        />
      </Group>
    </Canvas>
  );
};

export default PictureBbox;

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  innerContainer: {
    backgroundColor: "transparent",
    width: 100,
    height: 50,
  },
});
