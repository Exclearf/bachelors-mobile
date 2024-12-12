import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { useShallow } from "zustand/react/shallow";
import { useAppAppearanceSettings } from "@/stores/appAppearanceSettings";
import { Switch } from "react-native-gesture-handler";

type Props = {};

const SettingsTab = (props: Props) => {
  const [areBarsEnabled, setAreBardEnabled] = useAppAppearanceSettings(
    useShallow((state) => [state.areBarsEnabled, state.changeBarsEnabledState]),
  );

  return (
    <View style={{ flex: 1, backgroundColor: "#1e1e1e" }}>
      <Text>Settings W.I.P.</Text>
      <Switch onValueChange={setAreBardEnabled} value={areBarsEnabled}>
        123
      </Switch>
    </View>
  );
};

export default SettingsTab;

const styles = StyleSheet.create({});
