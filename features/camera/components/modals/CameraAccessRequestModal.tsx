import React from "react";
import { StyleSheet } from "react-native";

import Button from "@/features/shared/components/input/Button";
import ModalWindow from "@/features/shared/components/layout/ModalWindow";
import TranslatedText from "@/features/shared/components/text/TranslatedText";
import { useLocalization } from "@/features/shared/hooks/useLocalization";

type Props = {
  handler: () => void;
  isVisible: boolean;
};

const CameraAccessRequestModal = ({ handler, isVisible }: Props) => {
  const getTranslationKey = useLocalization("misc");

  return (
    <ModalWindow style={styles.container} isOpen={isVisible}>
      <ModalWindow.Header
        textStyle={styles.modalHeaderText}
        style={styles.modalHeader}
        translationKey={getTranslationKey("allowCameraAccess")}
      />
      <ModalWindow.Footer>
        <Button onPress={handler}>
          <TranslatedText
            style={{
              paddingVertical: 5,
              paddingHorizontal: 10,
            }}
            translationKey={getTranslationKey("allowCameraAccessAction")}
          />
        </Button>
      </ModalWindow.Footer>
    </ModalWindow>
  );
};

export default CameraAccessRequestModal;

const styles = StyleSheet.create({
  container: {
    width: "75%",
    gap: 50,
  },
  modalHeaderText: {
    textAlign: "center",
    width: "100%",
  },
  modalHeader: {
    alignSelf: "center",
  },
});
