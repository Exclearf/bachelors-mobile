import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React, { useEffect, useRef, useState } from "react";
import { LayoutChangeEvent, StyleSheet, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { useSharedValue } from "react-native-reanimated";
import { useShallow } from "zustand/react/shallow";

import { usePersonalizationStore } from "@/features/settings/stores/usePersonalizationStore";
import Button from "@/features/shared/components/input/Button";
import Slider from "@/features/shared/components/input/Slider";
import ToggleGroup from "@/features/shared/components/input/ToggleGroup";
import { useTheme } from "@/features/shared/hooks/useTheme";
import { capitalize } from "@/features/shared/utils/helper";

import { PhotoQualityBalanceValues } from "../../misc/constants";
import {
  PhotoQualityBalance,
  useCameraOptionsStore,
} from "../../stores/useCameraOptionsStore";

// TODO: Clean-up and divide into separate components
const CameraSettingsContainer = () => {
  const [exposure, setExposure, photoQualityBalance, setPhotoQualityBalance] =
    useCameraOptionsStore(
      useShallow((state) => [
        state.exposure,
        state.setExposure,
        state.photoQualityBalance,
        state.setPhotoQualityBalance,
      ]),
    );
  const scrollViewRef = useRef<ScrollView | null>(null);
  const theme = useTheme();
  const exposureValue = useSharedValue(
    exposure != null ? (exposure[1] - exposure[0]) / 2 : 0,
  );
  const [scrollViewWidth, setScrollViewWidth] = useState(0);
  const getIconSize = usePersonalizationStore((state) => state.getIconSize);

  const iconSize = 1.5 * getIconSize();

  useEffect(() => {
    if (exposure == null) return;

    exposureValue.set(Math.abs(exposure[0]) + exposure[2]);
  }, [exposure, exposureValue]);

  const onLayout = (e: LayoutChangeEvent) => {
    e.target.measure((x, y, width) => setScrollViewWidth(width));
  };

  return (
    <ScrollView
      ref={scrollViewRef}
      horizontal
      onLayout={onLayout}
      contentContainerStyle={styles.container}
    >
      <View
        style={[
          styles.exposureSliderContainer,
          { width: scrollViewWidth * 0.9 },
        ]}
      >
        <MaterialIcons
          name="hd"
          size={iconSize}
          color={theme?.primaryForeground}
        />
        <ToggleGroup
          width={scrollViewWidth * 0.7 + 25}
          height={30}
          selectedIndex={PhotoQualityBalanceValues.findIndex(
            (item) => item === photoQualityBalance,
          )}
          items={PhotoQualityBalanceValues.map((item) => ({
            id: item,
            title: capitalize(item),
          }))}
          onChange={(e) => setPhotoQualityBalance(e.id as PhotoQualityBalance)}
        />
      </View>
      <View
        style={[
          styles.exposureSliderContainer,
          { width: scrollViewWidth * 0.9 },
        ]}
      >
        <MaterialIcons
          name="exposure"
          size={iconSize}
          color={theme?.primaryForeground}
        />
        {exposure && (
          <Slider
            value={exposureValue}
            totalSteps={exposure[1] - exposure[0]}
            width={scrollViewWidth * 0.7 - 20}
            onChangeHandler={(e) => {
              setExposure([exposure[0], exposure[1], e + exposure[0]]);
            }}
          />
        )}
        <Button
          onPress={() => {
            console.log(1);
            exposure != null &&
              setExposure([
                exposure[0],
                exposure[1],
                (exposure[1] - Math.abs(exposure[0])) / 2,
              ]);
          }}
          style={{
            padding: 5,
          }}
        >
          <FontAwesome5
            name="undo-alt"
            size={iconSize / 1.5}
            color={theme?.primaryForeground}
          />
        </Button>
      </View>
    </ScrollView>
  );
};

export default CameraSettingsContainer;

const styles = StyleSheet.create({
  container: {
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    width: "100%",
    gap: 30,
    paddingHorizontal: 30,
    paddingVertical: 40,
    flexDirection: "column",
  },
  exposureSliderContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    gap: 10,
  },
});
