import { Pressable, StyleProp, View, ViewStyle } from "react-native";
import React, {
  createContext,
  Dispatch,
  forwardRef,
  PropsWithChildren,
  SetStateAction,
  useContext,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import Animated, {
  SharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";

type TriggerPosition = {
  x: number;
  y: number;
  width: number;
  height: number;
};

type ExpandableContextType = {
  expanded: SharedValue<number>;
  switchExpanded: () => void;
  triggerLayout: TriggerPosition | null;
  setTriggerLayout: Dispatch<SetStateAction<TriggerPosition | null>>;
};

const ExpandableContext = createContext<ExpandableContextType | undefined>(
  undefined,
);

const useExpandableContext = () => {
  const context = useContext(ExpandableContext);

  return context;
};

export type ExpandableRef = {
  switchExpanded: () => void;
  close: () => void;
};

type ExpandableProps = PropsWithChildren<{
  expanded: SharedValue<number>;
  height: number;
}>;

type ExpandableTriggerProps = PropsWithChildren<{}>;

type ExpandableContentProps = PropsWithChildren<{
  style?: StyleProp<ViewStyle>;
  isAbsolute?: boolean;
  padding?: number;
}>;

// A utility component for downstream usage
const ExpandableComponent = forwardRef(
  ({ expanded, height, children }: ExpandableProps, ref) => {
    const isExpanded = useRef(false);
    const [triggerLayout, setTriggerLayout] = useState<TriggerPosition | null>(
      null,
    );

    const switchExpanded = () => {
      expanded.set(withTiming(isExpanded.current ? 0 : height));

      isExpanded.current = !isExpanded.current;
    };

    const closeExpanded = () => {
      expanded.set(withTiming(0));
      isExpanded.current = false;
    };

    useImperativeHandle(ref, () => ({
      switchExpanded,
      close: closeExpanded,
    }));

    return (
      <ExpandableContext.Provider
        value={{
          expanded,
          switchExpanded,
          triggerLayout,
          setTriggerLayout,
        }}
      >
        <View style={{ position: "relative" }}>{children}</View>
      </ExpandableContext.Provider>
    );
  },
);

const Trigger = ({ children }: ExpandableTriggerProps) => {
  const context = useExpandableContext();
  const triggerRef = useRef<View>(null);

  if (!context) {
    return null;
  }
  const { setTriggerLayout, switchExpanded } = context;

  const onLayout = () => {
    triggerRef.current?.measure((x, y, width, height) => {
      setTriggerLayout({ x, y, width, height });
    });
  };

  return (
    <Pressable ref={triggerRef} onPress={switchExpanded} onLayout={onLayout}>
      {children}
    </Pressable>
  );
};

const Content = ({
  children,
  style,
  isAbsolute = true,
  padding = 0,
}: ExpandableContentProps) => {
  const context = useExpandableContext();

  if (!context) {
    console.log("Context is null");
    return null;
  }

  const { triggerLayout, expanded } = context;

  const viewStyle = useAnimatedStyle(() => {
    const optionalStyle: ViewStyle = isAbsolute
      ? {
          position: "absolute",
          top: (triggerLayout?.height ?? 0) + padding,
        }
      : {
          position: "relative",
          top: padding,
        };

    return {
      ...optionalStyle,
      width: triggerLayout?.width,
      height: expanded.value,
      overflow: "hidden",
    };
  });

  return <Animated.View style={[style, viewStyle]}>{children}</Animated.View>;
};

const Expandable = Object.assign(ExpandableComponent, {
  Trigger,
  Content,
});

export default Expandable;
