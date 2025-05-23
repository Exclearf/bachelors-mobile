import { Gesture } from "react-native-gesture-handler";
import { SharedValue, withTiming } from "react-native-reanimated";

import { HANDLE_HALF_SIZE } from "../misc/constants";
import { CornerCoordinates } from "../misc/types";

const useCornerGesture = (
  primaryCorner: CornerCoordinates,
  secondaryHorizontalCorner: CornerCoordinates,
  secondaryVerticalCorner: CornerCoordinates,
  clampingFunc: ([valueX, valueY]: [number, number]) => [number, number],
  xOffset: number,
  yOffset: number,
  cornerOpacity: SharedValue<number>,
) =>
  Gesture.Pan()
    .onBegin(() => {
      cornerOpacity.set(withTiming(1, { duration: 100 }));
    })
    .onChange((event) => {
      const [clampedX, clampedY] = clampingFunc([
        event.absoluteX - HANDLE_HALF_SIZE - xOffset,
        event.absoluteY - HANDLE_HALF_SIZE - yOffset,
      ]);
      primaryCorner.x.value = clampedX;
      primaryCorner.y.value = clampedY;

      secondaryHorizontalCorner.x.value = clampedX;
      secondaryVerticalCorner.y.value = clampedY;
    })
    .onFinalize(() => {
      cornerOpacity.set(withTiming(0.5));
    });

export default useCornerGesture;
