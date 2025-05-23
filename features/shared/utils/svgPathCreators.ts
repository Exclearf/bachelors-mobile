import { Skia } from "@shopify/react-native-skia";

const FULL_CIRCLE_RADIANS = 2 * Math.PI;
const INITIAL_ANGLE = -Math.PI / 2;

export const minTopPath = (height: number, width: number) =>
  Skia.Path.MakeFromSVGString(`M 0 0
          H ${width}
          V ${height}
          Q ${width} ${height} ${width * 0.95} ${height}
          H ${width * 0.05}
          Q 0 ${height} 0 ${height}
          Z
`)!;

export const maxTopPath = (height: number, width: number) =>
  Skia.Path.MakeFromSVGString(`M 0 0
            H ${width}
            V ${height}
            Q ${width} 0 ${width * 0.95} 0
            H ${width * 0.05}
            Q 0 0 0 ${height}
    Z
`)!;

export const minBottomPath = (height: number, width: number) =>
  Skia.Path.MakeFromSVGString(`M 0 0
            Q 0 0 ${width * 0.05} 0
            H ${width * 0.95}
            Q ${width} 0 ${width} 0
            V ${height}
            H 0
            Z
`)!;

export const maxBottomPath = (height: number, width: number) =>
  Skia.Path.MakeFromSVGString(`M 0 0
            Q 0 ${height} ${width * 0.05} ${height}
            H ${width * 0.95}
            Q ${width} ${height} ${width} 0
            V ${height}
            H 0
            Z
`)!;

export const useConfidenceIndicatorPath = (
  confidence: number,
  radius: number,
  offset: number,
) => {
  const angle = INITIAL_ANGLE + confidence * FULL_CIRCLE_RADIANS;
  const center = radius + offset;
  const largeArcFlag = confidence > 0.5 ? 1 : 0;

  const x0 = center + radius * Math.cos(INITIAL_ANGLE);
  const y0 = center + radius * Math.sin(INITIAL_ANGLE);

  const x1 = center + radius * Math.cos(angle);
  const y1 = center + radius * Math.sin(angle);

  return Skia.Path.MakeFromSVGString(`
            M ${center} ${center}
            L ${x0} ${y0}
            A ${radius} ${radius}, 0, ${largeArcFlag}, 1, ${x1} ${y1}
            Z
`)!;
};
