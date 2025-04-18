import Entypo from "@expo/vector-icons/Entypo";
import Feather from "@expo/vector-icons/Feather";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs } from "expo-router";
import React from "react";
import { Pressable, StyleSheet } from "react-native";

import LoginScreen from "@/features/auth/LoginScreen";
import { useAuthStore } from "@/features/auth/stores/authStore";
import { usePersonalizationStore } from "@/features/settings/stores/personalizationStore";
import { useAppSetup } from "@/features/shared/hooks/useAppSetup";

const RootLayout = () => {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const theme = usePersonalizationStore((state) => state.theme);

  // This hook is used to prevent the splash screen from hiding before the app is fully loaded
  // It is placed here in order not to re-render the app
  useAppSetup();

  if (!isLoggedIn && false) {
    return <LoginScreen />;
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: [
          styles.tabBarStyle,
          {
            backgroundColor: theme?.background,
            borderColor: theme?.primaryBackground,
          },
        ],
        tabBarItemStyle: styles.centerItems,
        tabBarShowLabel: false,
        tabBarButton: (props) => (
          <Pressable
            {...props}
            style={[styles.centerItems, styles.tabBarButton]}
          />
        ),
        tabBarInactiveTintColor: theme?.mutedForeground,
        tabBarActiveTintColor: theme?.secondaryForeground,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="sign-language" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="study"
        options={{
          tabBarIcon: ({ color, size }) => (
            <Feather name="book-open" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          tabBarIcon: ({ color, size }) => (
            <Entypo name="dots-three-horizontal" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
};

export default RootLayout;

const styles = StyleSheet.create({
  tabBarStyle: {
    borderTopWidth: 1.5,
    borderWidth: 0,
    height: "7%",
  },
  centerItems: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  tabBarButton: { flex: 1, width: "100%" },
});
