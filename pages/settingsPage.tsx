import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { useShallow } from "zustand/react/shallow";
import { useAppAppearanceSettings } from "@/stores/appAppearanceSettings";
import { Switch } from "react-native-gesture-handler";
import { useAuthStore } from "@/stores/authStore";
import Button from "@/components/utils/Button";

type Props = {};

const SettingsPage = (props: Props) => {
  const [areBarsEnabled, setAreBardEnabled] = useAppAppearanceSettings(
    useShallow((state) => [state.areBarsEnabled, state.changeBarsEnabledState]),
  );

  const setIsSignedIn = useAuthStore((state) => state.setIsLoggedIn);

  return (
    <View style={styles.container}>
      <Button
        width={128}
        height={48}
        backgroundColor="transparent"
        onPress={() => setIsSignedIn(false)}
      >
        <Text style={styles.logOutText}>Log Out</Text>
      </Button>
      <Switch onValueChange={setAreBardEnabled} value={areBarsEnabled}></Switch>
    </View>
  );
};

export default SettingsPage;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#1e1e1e", paddingTop: 10 },
  logOutText: {
    color: "#fff",
    fontSize: 16,
  },
});
