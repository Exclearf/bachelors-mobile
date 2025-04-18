import { SharedValue, useDerivedValue } from "react-native-reanimated";
import { useAppDimensions } from "./useAppDimensions";
import { SkPath } from "@shopify/react-native-skia";

type SkiaPathCreator = (height: number, width: number) => SkPath;

export type UseSkiaPathProps = {
    animatedPosition: SharedValue<number>;
    height: number;
    maxPathCreator: SkiaPathCreator;
    minPathCreator: SkiaPathCreator;
};

export const useSkiaPath = ({
    animatedPosition,
    height,
    minPathCreator,
    maxPathCreator,
}: UseSkiaPathProps) => {
    const { height: safeHeight, width: safeWidth } = useAppDimensions();

    const minPath = minPathCreator(height, safeWidth);
    const maxPath = maxPathCreator(height, safeWidth);

    const path = useDerivedValue(() => {
        'worklet';
        const t = 1 - Math.min(1, Math.max(0, animatedPosition.value / safeHeight));
        return minPath.interpolate(maxPath, t)!;
    }, [animatedPosition, safeHeight, minPath, maxPath]);

    return path;
}
