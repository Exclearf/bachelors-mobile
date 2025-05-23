import { useAnimatedStyle } from "react-native-reanimated";

import { CornerCoordinates } from "../misc/types";

const useCornerAnimatedStyle = (
  corner: CornerCoordinates,
  topOffset: number,
  leftOffset: number,
) =>
  useAnimatedStyle(() => {
    return {
      top: corner.y.value - topOffset,
      left: corner.x.value - leftOffset,
    };
  });

export default useCornerAnimatedStyle;
