import React, { useEffect, useState } from "react";
import { NativeMethods } from "react-native";

export type ComponentSize = {
  x: number;
  y: number;
  width: number;
  height: number;
};

const useComponentSize = (
  ref: React.RefObject<NativeMethods | null>,
): ComponentSize | null => {
  const [componentSize, setComponentSize] = useState<ComponentSize | null>(
    null,
  );

  useEffect(() => {
    ref.current?.measureInWindow((x, y, width, height) => {
      setComponentSize({ x, y, width, height });
    });
  }, [ref]);

  return componentSize;
};

export default useComponentSize;
