import React, { ComponentType, forwardRef } from "react";

export const WithForwardRef = <P, DP extends Partial<Pick<P, keyof P>>>(
  Component: ComponentType<P>,
  defaultProps?: DP,
) => {
  const componentForwarded = forwardRef<unknown, Omit<P, keyof DP>>(
    (props, ref) => {
      return (
        <Component
          {...({
            ...defaultProps,
            ...props,
          } as P)}
          ref={ref}
        />
      );
    },
  );

  componentForwarded.displayName = `WithForwardRef<${Component.displayName}>`;

  return componentForwarded;
};
