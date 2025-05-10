import React, { lazy, Suspense, useContext } from "react";
import { StyleSheet, View } from "react-native";

import { usePersonalizationStore } from "@/features/settings/stores/personalizationStore";
import Skeleton from "@/features/shared/components/feedback/Skeleton";
import { AppDimensionsContext } from "@/features/shared/contexts/appDimensions";
import { useLocalization } from "@/features/shared/hooks/useLocalization";

const SettingsSections = lazy(
  () => import("@/features/settings/SettingsSections"),
);
const UserInfo = lazy(() => import("@/features/settings/UserInfo"));

const SettingsTab = () => {
  const { height } = useContext(AppDimensionsContext);
  const getTranslationKey = useLocalization("settingsPage");
  const theme = usePersonalizationStore((state) => state.theme);

  return (
    <View style={[styles.container, { backgroundColor: theme?.background }]}>
      <Suspense
        fallback={
          <Skeleton
            style={{
              height: height * 0.05,
              width: "100%",
            }}
          />
        }
      >
        <UserInfo getTranslationKey={getTranslationKey} height={height} />
      </Suspense>
      <Suspense
        fallback={
          <Skeleton
            style={{
              width: "100%",
              height: height * 0.8,
            }}
          />
        }
      >
        <SettingsSections
          getTranslationKey={getTranslationKey}
          height={height}
        />
      </Suspense>
    </View>
  );
};

export default SettingsTab;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 0,
    paddingHorizontal: "3%",
    gap: 10,
    paddingBottom: 10,
    display: "flex",
    position: "relative",
  },
});
