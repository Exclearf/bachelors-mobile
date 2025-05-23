import { Canvas, Circle, Path } from "@shopify/react-native-skia";
import { StyleSheet } from "react-native";
import { useShallow } from "zustand/react/shallow";

import { usePersonalizationStore } from "@/features/settings/stores/personalizationStore";

import { useTheme } from "../../hooks/useTheme";
import { useConfidenceIndicatorPath } from "../../utils/svgPathCreators";

type CircleIndicatorProps = {
  fillValue: number;
};

const CIRCLE_INDICATOR_OFFSET = 2;

const CircleIndicator = ({ fillValue }: CircleIndicatorProps) => {
  const [fontSize, fontScale] = usePersonalizationStore(
    useShallow((state) => [state.fontSize, state.fontScale]),
  );
  const theme = useTheme();

  const indicatorRadius = fontSize.medium * fontScale;

  const indicatorPath = useConfidenceIndicatorPath(
    fillValue,
    indicatorRadius,
    2,
  );

  const getRedColor = (strength: number) => 255 * (1 - strength);

  const getGreenColor = (strength: number) => 255 * strength;

  const indicatorRadiusOffseted = indicatorRadius + CIRCLE_INDICATOR_OFFSET;

  return (
    <Canvas
      style={[
        styles.container,
        {
          width: indicatorRadius * 2 + CIRCLE_INDICATOR_OFFSET * 2,
          height: indicatorRadius * 2 + CIRCLE_INDICATOR_OFFSET * 2,
        },
      ]}
    >
      <Circle
        cx={indicatorRadiusOffseted}
        cy={indicatorRadiusOffseted}
        r={indicatorRadius}
        color={theme?.secondaryBackground}
      />

      <Path
        path={indicatorPath}
        color={`rgb(${getRedColor(fillValue)}, ${getGreenColor(fillValue)}, 0)`}
      />

      <Circle
        cx={indicatorRadiusOffseted}
        cy={indicatorRadiusOffseted}
        r={indicatorRadius}
        color={theme?.mutedForeground}
        style="stroke"
        strokeWidth={1}
      />
    </Canvas>
  );
};

export default CircleIndicator;

const styles = StyleSheet.create({
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
});
