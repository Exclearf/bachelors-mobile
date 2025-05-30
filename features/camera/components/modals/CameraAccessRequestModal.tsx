import React from "react";

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
    <ModalWindow
      isOpen={isVisible}
      style={{
        width: "80%",
        padding: "5%",
      }}
    >
      <ModalWindow.Header
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
