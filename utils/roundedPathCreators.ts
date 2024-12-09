import { useCallback } from "react";
import { SharedValue, useDerivedValue } from "react-native-reanimated";

export const useBottomPath = () => {
  const pathCreator = useCallback((borderRadius: number) => {
    "worklet";
    return `M 0 0
          Q 0 ${borderRadius} 5 ${borderRadius}
          H 95
          Q 100 ${borderRadius} 100 0
          V 100
          H 0
       `;
  }, []);

  return pathCreator;
};

export const useTopPath = () => {
  const pathCreator = useCallback((borderRadius: number) => {
    "worklet";
    return `M 0 0
            H 100
            V 30
            Q 100 ${30 - borderRadius} 95 ${30 - borderRadius}
            H 5
            Q 0 ${30 - borderRadius} 0 30
    Z
`;
  }, []);

  return pathCreator;
};

interface UseSkiaPathProps {
  animatedPosition: SharedValue<number>;
  height: number;
  pathCreator: (borderRadius: number) => string;
}

export function useSkiaPath({
  animatedPosition,
  height,
  pathCreator,
}: UseSkiaPathProps) {
  const borderRadius = useDerivedValue(() => {
    const pos = animatedPosition?.get() ?? 0;
    return (32 * pos) / height;
  }, [animatedPosition]);

  const skiaPath = useDerivedValue(() => {
    const path = pathCreator(borderRadius.value);
    return path || "M 0 0";
  }, [pathCreator, borderRadius]);

  return skiaPath;
}
