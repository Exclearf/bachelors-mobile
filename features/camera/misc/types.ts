import { SharedValue } from "react-native-reanimated";

export type CornerCoordinates = {
  x: SharedValue<number>;
  y: SharedValue<number>;
};

export type CornerRadius = 1 | -1;
