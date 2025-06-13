import { Path } from "@shopify/react-native-skia";
import { DerivedValue } from "react-native-reanimated";

import useAnimatedCorner from "../../hooks/useAnimatedCorner";
import { CornerCoordinates, CornerRadius } from "../../misc/types";

type CornerPathProps = {
  corner: CornerCoordinates;
  width: number;
  height: number;
  offsetX: number;
  offsetY: number;
  verticalCornerRadius: CornerRadius;
  horizontalCornerRadius: CornerRadius;
  sweepFlag: number;
  cornerRadius: number;
  cornerStyle: DerivedValue<string>;
};

const CornerPath = ({
  corner,
  width,
  height,
  offsetX,
  offsetY,
  verticalCornerRadius,
  horizontalCornerRadius,
  sweepFlag,
  cornerRadius,
  cornerStyle,
}: CornerPathProps) => {
  const cornerPath = useAnimatedCorner(
    corner,
    width,
    height,
    offsetX,
    offsetY,
    verticalCornerRadius,
    horizontalCornerRadius,
    sweepFlag,
    cornerRadius,
  );

  return (
    <Path
      style={"stroke"}
      strokeWidth={2}
      strokeCap={"round"}
      color={cornerStyle}
      path={cornerPath}
    />
  );
};

export default CornerPath;
