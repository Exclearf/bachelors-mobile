import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";

import TranslatedText from "@/features/shared/components/text/TranslatedText";
import { useLocalization } from "@/features/shared/hooks/useLocalization";
import { useTheme } from "@/features/shared/hooks/useTheme";
import { debounce } from "@/features/shared/utils/helper";
import SearchBar from "@/features/study/components/SearchBar";
import SignPage from "@/features/study/components/SignPage";
import useSearchResults from "@/features/study/hooks/useSearchResults";

const StudyTab = () => {
  const getTranslationKey = useLocalization("studyPage");
  const theme = useTheme();
  const [searchTerm, setSearchTerm] = useState("");
  const [fetchResults] = useSearchResults();

  const setSearchTermDebounced = debounce(setSearchTerm, 500);

  return (
    <View style={[{ backgroundColor: theme?.background }, styles.container]}>
      <View style={styles.headerContainer}>
        <TranslatedText
          fontSize="large"
          isBold={true}
          style={[{ color: theme?.primaryForeground }]}
          translationKey={getTranslationKey("headerText")}
        />
      </View>
      <SearchBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTermDebounced}
      />
      <SignPage fetchPage={fetchResults} searchTerm={searchTerm} />
    </View>
  );
};

export default StudyTab;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 30,
  },
  headerContainer: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
});
