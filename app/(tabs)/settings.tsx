import { Pressable, Text, View } from "react-native";
import React from "react";
import { useShallow } from "zustand/react/shallow";
import { useAppAppearanceSettings } from "@/stores/appAppearanceSettings";
import { Switch } from "react-native-gesture-handler";
import { useAuth } from "@/stores/authStore";

const SettingsTab = () => {
  const [areBarsEnabled, setAreBardEnabled] = useAppAppearanceSettings(
    useShallow((state) => [state.areBarsEnabled, state.changeBarsEnabledState]),
  );

  const setIsSignedIn = useAuth((state) => state.setIsLoggedIn);

  return (
    <View style={{ flex: 1, backgroundColor: "#1e1e1e" }}>
      <Text>Settings W.I.P.</Text>
      <Pressable onPress={() => setIsSignedIn(false)}>
        <Text>Log Out</Text>
      </Pressable>
      <Switch onValueChange={setAreBardEnabled} value={areBarsEnabled}></Switch>
    </View>
  );
};

export default SettingsTab;
