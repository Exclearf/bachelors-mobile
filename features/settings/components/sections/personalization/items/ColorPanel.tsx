import React, { useEffect, useState } from "react";
import ColorPicker, { Panel2 } from "reanimated-color-picker";
import { usePersonalizationStore } from "@/features/settings/stores/personalizationStore";
import Skeleton from "@/features/shared/components/feedback/Skeleton";
import { View } from "react-native";
import { useShallow } from "zustand/react/shallow";

type Props = {
  width: number;
};

const ColorPanel = ({ width }: Props) => {
  const [isRendered, setIsRendered] = useState(true);
  const [showSkeleton, setShowSkeleton] = useState(false);
  const theme = usePersonalizationStore((state) => state.theme);
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
          width: width * 0.55,
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
          width: width * 0.55,
          overflow: "hidden",
        }}
      >
        {isRendered && (
          <Panel2
            verticalChannel={themeType === "dark" ? "brightness" : "saturation"}
            style={{
              width: width * 0.55,
              height: (width * 0.55) / 2,
              borderRadius: 5,
            }}
          />
        )}
        {showSkeleton && (
          <Skeleton
            style={{
              position: "absolute",
              top: 0,
              width: width * 0.55,
              height: width * 0.55,
              borderRadius: 5,
            }}
          />
        )}
      </View>
    </ColorPicker>
  );
};

export default ColorPanel;
