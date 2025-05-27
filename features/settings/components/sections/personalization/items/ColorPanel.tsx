import React, { useEffect, useState } from "react";
import { View } from "react-native";
import ColorPicker, { Panel2 } from "reanimated-color-picker";
import { useShallow } from "zustand/react/shallow";

import { useSettingsItemWidth } from "@/features/settings/hooks/useSettingsItemWidth";
import { usePersonalizationStore } from "@/features/settings/stores/usePersonalizationStore";
import Skeleton from "@/features/shared/components/feedback/Skeleton";
import { useTheme } from "@/features/shared/hooks/useTheme";

const ColorPanel = () => {
  const [isRendered, setIsRendered] = useState(true);
  const [showSkeleton, setShowSkeleton] = useState(false);
  const theme = useTheme();
  const { width } = useSettingsItemWidth();
  const [accentColor, setAccentColor, themeType] = usePersonalizationStore(
    useShallow((state) => [
      state.accentColor,
      state.setAccentColor,
      state.themeType,
    ]),
  );

  useEffect(() => {
    setIsRendered(false);
    setShowSkeleton(true);

    setTimeout(() => {
      setIsRendered(true);

      setTimeout(() => setShowSkeleton(false), 400);
    }, 0);
  }, [themeType]);

  return (
    <ColorPicker
      adaptSpectrum={true}
      boundedThumb={true}
      value={accentColor}
      style={[
        {
          width: width,
          transform: [{ scaleY: 1 }],
        },
      ]}
      onComplete={(e) => {
        setTimeout(() => setAccentColor(e.hsv), 0);
      }}
    >
      <View
        style={{
          borderColor: theme?.mutedForeground,
          borderWidth: 1,
          borderRadius: 5,
          width: width,
          overflow: "hidden",
        }}
      >
        {isRendered && (
          <Panel2
            verticalChannel={themeType === "dark" ? "brightness" : "saturation"}
            style={{
              width: width,
              height: width / 2,
              borderRadius: 5,
            }}
          />
        )}
        {showSkeleton && (
          <Skeleton
            style={{
              position: "absolute",
              top: 0,
              width: width,
              height: width,
              borderRadius: 5,
            }}
          />
        )}
      </View>
    </ColorPicker>
  );
};

export default ColorPanel;
