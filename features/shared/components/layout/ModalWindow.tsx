import AntDesign from "@expo/vector-icons/AntDesign";
import React from "react";
import {
  Pressable,
  StyleSheet,
  Modal,
  View,
  ViewStyle,
  TextStyle,
} from "react-native";

import { useLocalization } from "../../hooks/useLocalization";
import { useTheme } from "../../hooks/useTheme";
import Button from "../input/Button";
import ButtonIcon from "../input/ButtonIcon";
import TranslatedText, { FontSizeDescription } from "../text/TranslatedText";

export type ModalWindowProps = React.PropsWithChildren<{
  isOpen: boolean;
  closeCallback?: () => void;
  acceptCallback?: () => void;
  title?: string;
  style?: ViewStyle;
  wrapContent?: boolean;
  transparent?: boolean;
}>;

type ModalWindowHeaderProps = {
  translationKey: string;
  closeCallback?: () => void;
  titleFontSize?: FontSizeDescription;
  style?: ViewStyle;
  textStyle?: TextStyle;
};

type ModalWindowFooterProps = React.PropsWithChildren<{
  acceptCallback?: () => void;
  closeCallback?: () => void;
  buttonStyle?: ViewStyle;
  style?: ViewStyle;
}>;

type ContentWrapperProps = React.PropsWithChildren<{
  wrap: boolean;
  style?: ViewStyle;
}>;

const ModalHeader = ({
  translationKey,
  closeCallback,
  titleFontSize = "medium",
  style,
  textStyle,
}: ModalWindowHeaderProps) => {
  const theme = useTheme();

  return (
    <View style={[styles.modalHeader, style]}>
      <TranslatedText
        style={textStyle}
        fontSize={titleFontSize}
        translationKey={translationKey}
      />

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
  buttonStyle = {},
  children,
  style,
}: ModalWindowFooterProps) => {
  const getTranslationKey = useLocalization("misc");

  return (
    <View style={[styles.modalFooter, style]}>
      {children}
      {closeCallback && (
        <Button
          onPress={closeCallback}
          style={[styles.modalFooterButtons, buttonStyle]}
          variant="secondary"
        >
          <TranslatedText translationKey={getTranslationKey("cancel")} />
        </Button>
      )}
      {acceptCallback && (
        <Button
          onPress={acceptCallback}
          style={[styles.modalFooterButtons, buttonStyle]}
          variant="primary"
        >
          <TranslatedText translationKey={getTranslationKey("accept")} />
        </Button>
      )}
    </View>
  );
};

const ContentWrapper = ({ wrap, children, style }: ContentWrapperProps) => {
  const theme = useTheme();

  return wrap ? (
    <Pressable
      style={[
        {
          backgroundColor: theme?.background,
          borderColor: theme?.mutedForeground,
        },
        styles.modalBody,
        style,
      ]}
    >
      {children}
    </Pressable>
  ) : (
    <>{children}</>
  );
};

const ModalWindow = ({
  isOpen,
  closeCallback,
  acceptCallback,
  style,
  wrapContent = true,
  transparent = false,
  children,
}: ModalWindowProps) => {
  return (
    <Modal
      animationType="none"
      transparent={transparent}
      backdropColor={"rgba(0,0,0,0)"}
      visible={isOpen}
      onRequestClose={closeCallback ?? (() => {})}
    >
      <Pressable style={[styles.modalContainer]} onPress={closeCallback}>
        <ContentWrapper style={style} wrap={wrapContent}>
          {children}
        </ContentWrapper>
      </Pressable>
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
    alignItems: "center",
    paddingHorizontal: 5,
    paddingVertical: 5,
  },
  modalBody: {
    padding: 5,
    gap: 15,
    borderRadius: 10,
    borderWidth: 1,
    overflow: "hidden",
    display: "flex",
    justifyContent: "center",
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
