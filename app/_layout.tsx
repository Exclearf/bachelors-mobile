import { Dimensions, Text, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useEffect, useRef } from "react";
import { StatusBar } from "expo-status-bar";
import { CameraView, useCameraPermissions } from "expo-camera";
import { SafeAreaView } from "react-native-safe-area-context";
import { AppDimensionsContext } from "@/contexts/appDimensions";
import AppRoundedPath from "@/components/utils/AppRoundedPath";
import { useTopPath } from "@/utils/roundedPathCreators";
import { Slot } from "expo-router";
import AppBottomSheet, {
  AppBottomSheetRef,
} from "@/components/bottomSheet/bottomSheet";
import CameraBottomContainer from "@/components/camera/containers/cameraBottomContainer";
import CameraTopContainer from "@/components/camera/containers/cameraTopContainer";
import CameraOverlay from "@/components/camera/cameraOverlay";

const windowDimensions = Dimensions.get("window");

const appDimensions = {
  width: windowDimensions.width,
  height: windowDimensions.height,
};

export default function RootLayout() {
  const [cameraPermission, requestPermission] = useCameraPermissions();

  useEffect(() => {
    if (!cameraPermission?.granted) requestPermission();
  }, []);
  const appBottomSheetRef = useRef<AppBottomSheetRef>(null);

  return (
    <GestureHandlerRootView>
      <AppDimensionsContext.Provider value={appDimensions}>
        <StatusBar
          translucent={false}
          style={"dark"}
          backgroundColor="#1e1e1e"
        />
        <SafeAreaView
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            top: 13,
          }}
        >
          <AppRoundedPath
            zIndex={2}
            style={{ top: 1 }}
            barHeight={30}
            handlePadColor="transparent"
            animatedPosition={appBottomSheetRef.current?.animatedPosition!}
            pathCreator={useTopPath()}
          />
          <CameraView
            style={{
              top: -30,
              width: "100%",
              height: "100%",
            }}
          />
          <CameraOverlay
            height={appDimensions.height}
            animatedPosition={appBottomSheetRef.current?.animatedPosition}
          />
          <AppBottomSheet
            ref={appBottomSheetRef}
            snapPoints={["10", "55", "100%"]}
          >
            <Slot />
          </AppBottomSheet>
        </SafeAreaView>
      </AppDimensionsContext.Provider>
    </GestureHandlerRootView>
  );
}
