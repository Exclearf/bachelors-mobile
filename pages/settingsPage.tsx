import { Image, StyleSheet, Text, View } from "react-native";
import React, { useContext, useState } from "react";
import { useShallow } from "zustand/react/shallow";
import { useAuthStore } from "@/stores/authStore";
import Button from "@/components/utils/Button";
import { defaultPicture } from "@/hooks/useAuthFlow";
import { AppDimensionsContext } from "@/contexts/appDimensions";
import ToggleGroup from "@/components/utils/ToggleGroup";

const languages = [
  {
    id: "1",
    title: "Polish",
  },
  {
    id: "2",
    title: "English",
  },
];

const SettingsPage = () => {
  const { height } = useContext(AppDimensionsContext);

  const [setIsSignedIn, user] = useAuthStore(
    useShallow((state) => [state.setIsLoggedIn, state.user]),
  );

  const [picture, setPicture] = useState(user?.picture);

  console.log(picture);

  return (
    <View style={styles.container}>
      <View style={[styles.greetingsContainer, { height: height * 0.07 }]}>
        {user?.name && (
          <Text style={styles.greetingsText}>Hello, {user.name}</Text>
        )}
        {user?.picture && (
          <Image
            style={styles.greetinsImage}
            source={picture}
            onError={() => setPicture(defaultPicture)}
          />
        )}
      </View>
      <Button
        width={128}
        height={48}
        backgroundColor="transparent"
        onPress={() => setIsSignedIn(false)}
      >
        <Text style={styles.logOutText}>Log Out</Text>
      </Button>
      <View style={styles.languageToggleContainer}>
        <Text style={styles.languageToggleText}>Language: </Text>
        <ToggleGroup items={languages} onChange={(e) => console.log(e.id)} />
      </View>
    </View>
  );
};

export default SettingsPage;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#1e1e1e", paddingTop: 0 },
  logOutText: {
    color: "#fff",
    fontSize: 16,
  },
  greetingsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 5,
  },
  greetingsText: {
    fontSize: 24,
    color: "#fff",
  },
  greetinsImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  languageToggleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 5,
  },
  languageToggleText: { color: "white", fontSize: 16 },
});
