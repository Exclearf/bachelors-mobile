import React, { forwardRef, ComponentType } from "react";

export const WithForwardRef = <P, DP extends Partial<Pick<P, keyof P>>>(
  Component: ComponentType<P>,
  defaultProps?: DP,
) => {
  return forwardRef<unknown, Omit<P, keyof DP>>((props, ref) => {
    return <Component {...({ ...defaultProps, ...props } as P)} ref={ref} />;
  });
};
