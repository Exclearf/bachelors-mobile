import { StyleSheet, View } from "react-native";
import React, { useContext } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import SelectGroup, {
  SelectionGroupItemConfig,
} from "@/features/shared/components/input/selectGroup/SelectGroup";
import { useTranslationStore } from "@/features/translation/stores/translationStore";
import ExpandableModal from "@/features/camera/components/modals/ExpandableModal";
import History from "@/features/translation/History";
import SignTranslation from "@/features/translation/SignTranslation";
import TextTranslation from "@/features/translation/TextTranslation";
import { useLocalization } from "@/features/shared/hooks/useLocalization";
import { AppDimensionsContext } from "@/features/shared/contexts/appDimensions";
import { useTheme } from "@/features/shared/hooks/useTheme";

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

  return (
    <View style={{ ...styles.container, backgroundColor: theme?.background }}>
      <SelectGroup items={availableFunctions} />
      <View style={styles.innerContainer}>
        <ExpandableModal
          initialHeight={height * 0.55 - height * 0.11 - 36}
          padding={20}
          containerStyle={[
            styles.indexSection,
            { backgroundColor: theme?.primaryBackground },
          ]}
          titleTranslationKey={getTranslationKey("translation")}
        >
          {mode === "signToText" ? <SignTranslation /> : <TextTranslation />}
        </ExpandableModal>
        <History
          padding={20}
          containerStyle={[
            styles.indexSection,
            { backgroundColor: theme?.primaryBackground },
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
    boxShadow: "0px 0px 10px 1px rgba(15,15,15,0.5)",
  },
});
