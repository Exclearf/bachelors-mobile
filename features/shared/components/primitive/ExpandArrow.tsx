import {
  Canvas,
  Path,
  Skia,
  usePathInterpolation,
} from "@shopify/react-native-skia";
import React from "react";
import { StyleSheet, View } from "react-native";
import { SharedValue } from "react-native-reanimated";

import { useFontSize } from "../../hooks/useFontSize";

type Props = {
  expanded: SharedValue<number>;
  maxHeight: number;
};

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

const ExpandArrow = ({ expanded, maxHeight }: Props) => {
  const fontSize = useFontSize();
  const arrowDimensions = fontSize["regular"] * 1.25;

  const arrowPath = usePathInterpolation(
    expanded,
    [0, maxHeight],
    [
      createSkiaPath(createOpenArrow, arrowDimensions),
      createSkiaPath(createCloseArrow, arrowDimensions),
    ],
  );

  return (
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
  );
};

export default ExpandArrow;

const styles = StyleSheet.create({
  contentContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
});
