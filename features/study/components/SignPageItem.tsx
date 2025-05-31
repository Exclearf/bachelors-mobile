import { useMemo } from "react";
import { StyleSheet } from "react-native";
import uuid from "react-native-uuid";

import Button from "@/features/shared/components/input/Button";
import TranslatedText from "@/features/shared/components/text/TranslatedText";
import { GlossTranslation } from "@/features/shared/types/types";
import { TranslatedTextResponse } from "@/features/translation/utils/types";

type Props = {
  item: GlossTranslation;
  setItem: (item: TranslatedTextResponse | null) => void;
};

const SignPageItem = ({ item, setItem }: Props) => {
  const translatedTextResponseMockItem = useMemo(
    () => ({
      translatedVideos: {
        glossTranslations: [item],
        languageCode: "",
      },
      extractedText: "",
      id: uuid.v4(),
    }),
    [item],
  );

  return (
    <>
      <Button
        style={styles.containerItem}
        variant="secondary"
        onPress={() => setItem(translatedTextResponseMockItem)}
      >
        <TranslatedText translationKey={item.gloss} />
      </Button>
    </>
  );
};

export default SignPageItem;

const styles = StyleSheet.create({
  containerItem: {
    alignItems: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 7.5,
    width: "90%",
    borderRadius: 5,
    marginVertical: 5,
    marginHorizontal: "5%",
  },
});
