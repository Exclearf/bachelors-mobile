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

type ExpandableTriggerProps = PropsWithChildren<{
    style?: StyleProp<ViewStyle>;
}>;

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
                <View
                    style={{
                        position: "relative",
                    }}
                >
                    {children}
                    <View
                        style={{
                            borderBottomColor: "blue",
                            borderBottomWidth: 1,
                            bottom: -1,
                        }}
                    ></View>
                </View>
            </ExpandableContext.Provider>
        );
    },
);

const Trigger = ({ children, style }: ExpandableTriggerProps) => {
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
        <Pressable
            style={style}
            ref={triggerRef}
            onPress={switchExpanded}
            onLayout={onLayout}
        >
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
            borderColor: "blue",
            zIndex: 2,
        };
    });

    const tempStyle = Array.isArray(style) ? style : [style];

    return (
        <Animated.View style={[viewStyle, ...tempStyle]}>{children}</Animated.View>
    );
};

const Expandable = Object.assign(ExpandableComponent, {
    Trigger,
    Content,
});

export default Expandable;
