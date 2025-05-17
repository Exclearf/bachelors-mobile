import { Image, View } from "react-native";

import ModalWindow from "@/features/shared/components/layout/ModalWindow";
import { useAppDimensions } from "@/features/shared/hooks/useAppDimensions";

type TranslationConfirmationProps = {
  fileUri: string;
  translationKey: string;
  cancelCallback?: () => void;
  acceptCallback?: () => void;
};

const TranslationConfirmation = ({
  fileUri,
  translationKey,
  acceptCallback,
  cancelCallback,
}: TranslationConfirmationProps) => {
  const { width, height } = useAppDimensions();

  return (
    <ModalWindow isOpen={fileUri?.length !== 0}>
      <ModalWindow.Header
        translationKey={translationKey}
        closeCallback={cancelCallback}
      />
      <View style={{ paddingVertical: 5 }}>
        <Image
          source={{ uri: fileUri! }}
          style={{
            width: width * 0.85,
            height: height * 0.2,
            resizeMode: "contain",
          }}
        />
      </View>
      <ModalWindow.Footer
        closeCallback={cancelCallback}
        acceptCallback={acceptCallback}
      />
    </ModalWindow>
  );
};

export default TranslationConfirmation;
