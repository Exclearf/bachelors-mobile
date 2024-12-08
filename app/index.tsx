import { Dimensions, useColorScheme } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useEffect, useRef } from "react";
import { StatusBar } from "expo-status-bar";
import BottomPanel, { BottomPanelRef } from "./bottomPanel";
import { CameraView, useCameraPermissions } from "expo-camera";
import { SafeAreaView } from "react-native-safe-area-context";
import { AppDimensionsContext } from "@/contexts/appDimensions";
import AppRoundedPath from "@/components/utils/AppRoundedPath";
import { bottomLeft } from "@shopify/react-native-skia";
import { useBottomPath, useTopPath } from "@/utils/roundedPathCreators";

const windowDimensions = Dimensions.get("window");

const appDimensions = {
  width: windowDimensions.width,
  height: windowDimensions.height,
};

export default function Index() {
  const [cameraPermission, requestPermission] = useCameraPermissions();
  const currentColorScheme = useColorScheme() === "dark" ? "light" : "dark";
  const bottomPanelRef = useRef<BottomPanelRef>(null);

  useEffect(() => {
    if (!cameraPermission?.granted) requestPermission();
  }, []);

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
          {
            <AppRoundedPath
              zIndex={1}
              barHeight={30}
              handlePadColor="transparent"
              animatedPosition={bottomPanelRef.current?.animatedPosition}
              pathCreator={useTopPath()}
            />
          }
          <CameraView
            style={{
              top: -30,
              width: "100%",
              height: "100%",
            }}
          ></CameraView>
          <BottomPanel ref={bottomPanelRef} />
        </SafeAreaView>
      </AppDimensionsContext.Provider>
    </GestureHandlerRootView>
  );
}
