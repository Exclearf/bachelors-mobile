import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { StyleSheet, TextInput, View } from "react-native";
import { useShallow } from "zustand/react/shallow";

import { usePersonalizationStore } from "@/features/settings/stores/usePersonalizationStore";
import TranslatedText from "@/features/shared/components/text/TranslatedText";
import { useTheme } from "@/features/shared/hooks/useTheme";

type Props = {
  searchTerm: string;
  setSearchTerm: (newText: string) => void;
};

const PADDING = 10;

const SearchBar = ({ searchTerm, setSearchTerm }: Props) => {
  const theme = useTheme();

  const [fontScale, fontSize] = usePersonalizationStore(
    useShallow((state) => [state.fontScale, state.fontSize]),
  );

  const iconSize = fontSize.medium * fontScale;

  return (
    <View style={styles.container}>
      <View style={styles.iconWrapper}>
        <MaterialIcons
          name="search"
          size={iconSize}
          color={theme?.primaryForeground}
          style={styles.icon}
        />
      </View>
      <TextInput
        style={[
          styles.textInput,
          {
            borderColor: theme?.mutedForeground,
            paddingRight: iconSize + 2 * PADDING,
            height: iconSize * 2.25,
          },
        ]}
        onChangeText={(newText) => setSearchTerm(newText)}
      >
        <TranslatedText translationKey={searchTerm} translate={false} />
      </TextInput>
    </View>
  );
};

export default SearchBar;

const styles = StyleSheet.create({
  textInput: {
    width: "90%",
    borderRadius: 5,
    borderWidth: 1,
    padding: PADDING,
  },
  iconWrapper: {
    width: "90%",
    height: "100%",
    justifyContent: "center",
    alignItems: "flex-end",
    display: "flex",
    position: "absolute",
    padding: PADDING,
  },
  icon: {},
  container: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
});
