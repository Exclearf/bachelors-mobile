import { StyleSheet } from "react-native";
import React, { forwardRef, useImperativeHandle, useRef } from "react";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { SharedValue, useSharedValue } from "react-native-reanimated";
import AppRoundedPath from "../utils/AppRoundedPath";
import { useBottomPath } from "@/utils/roundedPathCreators";

type Props = {
  snapPoints: string[];
  children?: React.JSX.Element | React.JSX.Element[];
};

export interface AppBottomSheetRef {
  animatedPosition: SharedValue<number>;
}
const AppBottomSheet = forwardRef<AppBottomSheetRef, Props>(
  ({ snapPoints, children }, ref) => {
    const bottomSheetRef = useRef<BottomSheet>(null);
    const animatedPosition = useSharedValue(0);

    useImperativeHandle(ref, () => ({
      animatedPosition,
    }));

    return (
      <BottomSheet
        animatedPosition={animatedPosition}
        handleStyle={{
          display: "none",
          overflow: "hidden",
        }}
        enableDynamicSizing={false}
        backgroundStyle={{
          display: "none",
        }}
        containerStyle={{
          zIndex: 10,
        }}
        handleComponent={() => (
          <AppRoundedPath
            zIndex={2}
            barHeight={30}
            animatedPosition={animatedPosition}
            pathCreator={useBottomPath()}
          />
        )}
        overDragResistanceFactor={0}
        index={0}
        snapPoints={snapPoints}
        ref={bottomSheetRef}
      >
        <BottomSheetView style={{ backgroundColor: "#1E1E1E", height: "100%" }}>
          {children}
        </BottomSheetView>
      </BottomSheet>
    );
  },
);

export default AppBottomSheet;

const styles = StyleSheet.create({});
