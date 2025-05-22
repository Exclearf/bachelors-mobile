import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import Ionicons from "@expo/vector-icons/Ionicons";
import React, { useContext } from "react";
import { StyleSheet, View } from "react-native";

import ExpandableModal from "@/features/camera/components/modals/ExpandableModal";
import SelectGroup, {
  SelectionGroupItemConfig,
} from "@/features/shared/components/input/selectGroup/SelectGroup";
import { AppDimensionsContext } from "@/features/shared/contexts/appDimensions";
import { useLocalization } from "@/features/shared/hooks/useLocalization";
import { useTheme } from "@/features/shared/hooks/useTheme";
import TextTranslationPlayer from "@/features/translation/components/feedback/TextTranslationPlayer";
import History from "@/features/translation/components/layout/History";
import SignTranslation from "@/features/translation/components/layout/SignTranslation";
import { useTranslationStore } from "@/features/translation/stores/useTranslationStore";

const IndexTab = () => {
  const getTranslationKey = useLocalization("indexPage");
  const mode = useTranslationStore((state) => state.mode);
  const { height } = useContext(AppDimensionsContext);
  const theme = useTheme();
  const availableFunctions: SelectionGroupItemConfig[] = [
    {
      id: "signToText",
      translationKey: getTranslationKey("signToText"),
      onClick: () => {},
      icon: (props: any) => (
        <FontAwesome6 name="hands-asl-interpreting" {...props} />
      ),
    },
    {
      id: "textToSign",
      translationKey: getTranslationKey("textToSign"),
      onClick: () => {},
      icon: (props: any) => <Ionicons name="text" {...props} />,
    },
  ];

  const initialHeight = height - height * 0.11 - height * 0.07 - height * 0.06;

  return (
    <View
      style={{
        ...styles.container,
        backgroundColor: theme?.background,
      }}
    >
      <SelectGroup
        items={availableFunctions}
        containerHeight={height * 0.068}
      />
      <View style={styles.innerContainer}>
        <ExpandableModal
          initialHeight={initialHeight / 1.93}
          padding={height * 0.02}
          containerStyle={[
            styles.indexSection,
            {
              backgroundColor: theme?.primaryBackground,
              borderColor: theme?.mutedForeground,
            },
          ]}
          titleTranslationKey={getTranslationKey("translation")}
        >
          {mode === "signToText" ? (
            <SignTranslation />
          ) : (
            <TextTranslationPlayer />
          )}
        </ExpandableModal>
        <History
          padding={height * 0.02}
          height={initialHeight / 1.93}
          containerStyle={[
            styles.indexSection,
            {
              backgroundColor: theme?.primaryBackground,
              borderColor: theme?.mutedForeground,
            },
          ]}
        />
      </View>
    </View>
  );
};

export default IndexTab;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  innerContainer: {
    position: "relative",
    width: "100%",
    flex: 1,
    display: "flex",
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  indexSection: {
    borderRadius: 10,
    borderWidth: 1,
    boxShadow: "0px 0px 10px 1px rgba(15,15,15,0.5)",
  },
});
