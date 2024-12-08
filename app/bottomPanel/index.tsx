import { StyleSheet, Text, TextBase, View } from "react-native";
import React, { forwardRef, useImperativeHandle, useRef } from "react";
import AppBottomSheet, {
  AppBottomSheetRef,
} from "@/components/bottomSheet/bottomSheet";
import { SharedValue } from "react-native-reanimated";

type Props = {};

export type BottomPanelRef = {
  animatedPosition: SharedValue<number>;
};

const BottomPanel = forwardRef<BottomPanelRef, Props>((props: Props, ref) => {
  const appBottomSheetRef = useRef<AppBottomSheetRef>(null);

  useImperativeHandle(ref, () => ({
    animatedPosition: appBottomSheetRef.current?.animatedPosition!,
  }));

  return (
    <AppBottomSheet ref={appBottomSheetRef} snapPoints={["10", "40", "100%"]}>
      <View>
        <Text style={{ color: "white", textAlign: "center" }}>
          Y so serious???
        </Text>
      </View>
    </AppBottomSheet>
  );
});

export default BottomPanel;

const styles = StyleSheet.create({});
