import { useState } from "react";
import { StyleSheet, View } from "react-native";

import Button from "@/features/shared/components/input/Button";
import ModalWindow from "@/features/shared/components/layout/ModalWindow";
import TranslatedText from "@/features/shared/components/text/TranslatedText";
import {
  useLocalization,
  UseLocalizationFunction,
} from "@/features/shared/hooks/useLocalization";

type Props = {
  getTranslationKey: UseLocalizationFunction;
};

const AboutButton = ({ getTranslationKey }: Props) => {
  getTranslationKey = useLocalization(getTranslationKey("about"));
  const [aboutOpen, setAboutOpen] = useState(false);

  const closeCallback = () => setAboutOpen(false);

  return (
    <>
      <Button style={styles.aboutButton} onPress={() => setAboutOpen(true)}>
        <TranslatedText translationKey={getTranslationKey("title")} />
      </Button>

      <ModalWindow closeCallback={closeCallback} isOpen={aboutOpen}>
        <ModalWindow.Header
          closeCallback={closeCallback}
          translationKey={getTranslationKey("title")}
        />
        <View>
          <TranslatedText translationKey={getTranslationKey("content")} />
        </View>
        <ModalWindow.Footer closeCallback={closeCallback} />
      </ModalWindow>
    </>
  );
};

export default AboutButton;

const styles = StyleSheet.create({
  aboutButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
});
