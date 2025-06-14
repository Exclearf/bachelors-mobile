import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import {
  errorCodes,
  saveDocuments,
  pick,
  types,
  keepLocalCopy,
} from "@react-native-documents/picker";
import { File, Paths } from "expo-file-system/next";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { useShallow } from "zustand/react/shallow";

import { useSettingsItemWidth } from "@/features/settings/hooks/useSettingsItemWidth";
import { SettingsSectionSubItemType } from "@/features/settings/SettingsSections";
import { usePersonalizationStore } from "@/features/settings/stores/usePersonalizationStore";
import Button from "@/features/shared/components/input/Button";
import ModalWindow from "@/features/shared/components/layout/ModalWindow";
import TranslatedText from "@/features/shared/components/text/TranslatedText";
import { useTheme } from "@/features/shared/hooks/useTheme";
import log from "@/features/shared/utils/log";
import useShowToast from "@/features/shared/utils/showToast";
import {
  HistoryJsonType,
  useTranslationStore,
} from "@/features/translation/stores/useTranslationStore";

import SettingsMenuEntryText from "../../shared/SettingsMenuEntryText";

const exportFileUri = Paths.cache.uri + "history.json";

const HistoryControl = ({
  textStyle,
  getTranslationKey,
}: SettingsSectionSubItemType) => {
  const { width } = useSettingsItemWidth();
  const iconSize = usePersonalizationStore((state) => state.getIconSize);
  const theme = useTheme();
  const showToast = useShowToast({ getTranslationKey });
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [getHistory, setHistory] = useTranslationStore(
    useShallow((state) => [state.getHistory, state.setHistory]),
  );

  const importHistory = async () => {
    try {
      const [result] = await pick({
        type: types.json,
      });

      if (result.error) {
        showToast("operationNotComplete");
      }

      const [copyResult] = await keepLocalCopy({
        files: [
          {
            uri: result.uri,
            fileName: "history",
          },
        ],
        destination: "cachesDirectory",
      });

      if (copyResult.status !== "success") {
        throw new Error(
          `Failed to copy the file to local dir: ${copyResult.status} | ${copyResult.copyError}`,
        );
      }

      if (copyResult.status === "success") {
        const file = new File(copyResult.localUri);

        const importedTranslations = JSON.parse(file.text()) as HistoryJsonType;

        setHistory(importedTranslations);

        showToast("operationComplete");
      }
    } catch (e) {
      showToast("operationNotComplete");
      log.warn(e);
    }
  };

  const exportHistory = async () => {
    try {
      log.debug("Exporting history.");

      const file = new File(exportFileUri);

      file.write(JSON.stringify(getHistory()));

      const [{ uri: targetUri }] = await saveDocuments({
        sourceUris: [exportFileUri],
        copy: false,
        mimeType: types.json,
        fileName: "history",
      });

      if (targetUri != null) showToast("operationComplete");
    } catch (e) {
      if (typeof e === "string" && e !== errorCodes.OPERATION_CANCELED)
        showToast("operationNotComplete");
      log.warn(e);
    }
  };

  const closeConfirmation = () => setShowConfirmation(false);

  return (
    <>
      <SettingsMenuEntryText
        textStyle={textStyle}
        textTranslationKey={getTranslationKey("history")}
      />

      <View style={[styles.controlsContainer, { width }]}>
        {(
          [
            {
              iconName: "file-import-outline",
              onPress: () => setShowConfirmation(true),
            },
            {
              iconName: "file-export-outline",
              onPress: exportHistory,
            },
          ] as const
        ).map((item) => (
          <Button
            key={item.iconName}
            style={styles.controlButton}
            onPress={item.onPress}
          >
            <MaterialCommunityIcons
              name={item.iconName}
              size={iconSize()}
              color={theme?.primaryForeground}
            />
          </Button>
        ))}
      </View>

      <ModalWindow
        isOpen={showConfirmation}
        style={styles.confirmationModal}
        closeCallback={closeConfirmation}
      >
        <ModalWindow.Header
          titleFontSize="large"
          closeCallback={closeConfirmation}
          translationKey={getTranslationKey("confirmImportHeader")}
        />
        <TranslatedText
          translationKey={getTranslationKey("confirmImportContent")}
        />
        <ModalWindow.Footer
          closeCallback={closeConfirmation}
          acceptCallback={() => {
            closeConfirmation();
            importHistory();
          }}
        />
      </ModalWindow>
    </>
  );
};

export default HistoryControl;

const styles = StyleSheet.create({
  controlsContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
  controlButton: {
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  confirmationModal: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    gap: 30,
  },
});
