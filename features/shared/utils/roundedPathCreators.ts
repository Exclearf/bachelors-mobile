import { Skia } from "@shopify/react-native-skia";

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
