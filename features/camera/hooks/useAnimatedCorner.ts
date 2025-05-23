import { useDerivedValue } from "react-native-reanimated";

import { CornerCoordinates, CornerRadius } from "../misc/types";

const useAnimatedCorner = (
  corner: CornerCoordinates,
  width: number,
  height: number,
  offsetX: number,
  offsetY: number,
  verticalCornerRadius: CornerRadius,
  horizontalCornerRadius: CornerRadius,
  sweepFlag: number,
  cornerRadius: number,
) =>
  useDerivedValue(() => {
    const cornerRadiusInner = cornerRadius + Math.abs(offsetX);
    return `
    M ${corner.x.value + offsetX} ${corner.y.value + offsetY + height}
    L ${corner.x.value + offsetX} ${corner.y.value + offsetY + cornerRadiusInner * verticalCornerRadius}
    A ${cornerRadiusInner} ${cornerRadiusInner} 0 0 ${sweepFlag} ${corner.x.value + offsetX + cornerRadiusInner * horizontalCornerRadius} ${corner.y.value + offsetY}
    L ${corner.x.value + width + offsetX} ${corner.y.value + offsetY}
    `;
  });

export default useAnimatedCorner;
