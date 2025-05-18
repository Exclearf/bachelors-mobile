import AntDesign from "@expo/vector-icons/AntDesign";
import React from "react";
import { StyleSheet, Modal, View } from "react-native";

import { useLocalization } from "../../hooks/useLocalization";
import { useTheme } from "../../hooks/useTheme";
import Button from "../input/Button";
import ButtonIcon from "../input/ButtonIcon";
import TranslatedText from "../text/TranslatedText";

export type ModalWindowProps = React.PropsWithChildren<{
  isOpen: boolean;
  closeCallback?: () => void;
  acceptCallback?: () => void;
  title?: string;
}>;

type ModalWindowHeaderProps = {
  translationKey: string;
  closeCallback?: () => void;
};

type ModalWindowFooterProps = {
  acceptCallback?: () => void;
  closeCallback?: () => void;
};

const ModalHeader = ({
  translationKey,
  closeCallback,
}: ModalWindowHeaderProps) => {
  const theme = useTheme();

  return (
    <View style={styles.modalHeader}>
      <TranslatedText translationKey={translationKey} fontSize="medium" />

      {closeCallback && (
        <ButtonIcon
          onPress={closeCallback}
          IconComponent={
            <AntDesign
              name="close"
              size={24}
              color={theme?.primaryForeground}
            />
          }
        />
      )}
    </View>
  );
};

const ModalFooter = ({
  acceptCallback,
  closeCallback,
}: ModalWindowFooterProps) => {
  const getTranslationKey = useLocalization("misc");

  return (
    <View style={styles.modalFooter}>
      {closeCallback && (
        <Button
          onPress={closeCallback}
          style={styles.modalFooterButtons}
          variant="secondary"
        >
          <TranslatedText translationKey={getTranslationKey("cancel")} />
        </Button>
      )}
      {acceptCallback && (
        <Button
          onPress={acceptCallback}
          style={styles.modalFooterButtons}
          variant="primary"
        >
          <TranslatedText translationKey={getTranslationKey("accept")} />
        </Button>
      )}
    </View>
  );
};

const ModalWindow = ({
  isOpen,
  closeCallback,
  acceptCallback,
  children,
}: ModalWindowProps) => {
  const theme = useTheme();

  return (
    <Modal
      animationType="none"
      transparent={false}
      backdropColor={"transparent"}
      visible={isOpen}
    >
      <View style={styles.modalContainer}>
        <View
          style={[
            styles.modalBody,
            {
              backgroundColor: theme?.background,
              borderColor: theme?.mutedForeground,
              borderWidth: 1,
            },
          ]}
        >
          {children}
        </View>
      </View>
    </Modal>
  );
};

ModalWindow.Header = ModalHeader;
ModalWindow.Footer = ModalFooter;

export default ModalWindow;

const styles = StyleSheet.create({
  modalContainer: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  modalHeader: {
    display: "flex",
    justifyContent: "space-between",
    flexDirection: "row",
    padding: 10,
    paddingBottom: 5,
  },
  modalBody: {
    padding: 5,
    borderRadius: 10,
    overflow: "hidden",
  },
  modalFooter: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
    marginBottom: 5,
    marginRight: 5,
  },
  modalFooterButtons: {
    borderRadius: 5,
    paddingVertical: 6,
    width: "30%",
  },
});
