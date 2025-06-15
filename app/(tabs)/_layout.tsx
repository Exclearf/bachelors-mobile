import Entypo from "@expo/vector-icons/Entypo";
import Feather from "@expo/vector-icons/Feather";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs } from "expo-router";
import React from "react";
import { Pressable, StyleSheet } from "react-native";
import { PressableProps } from "react-native/Libraries/Components/Pressable/Pressable";

import LoginScreen from "@/features/auth/LoginScreen";
import { useAuthStore } from "@/features/auth/stores/useAuthStore";
import { useAppSetup } from "@/features/shared/hooks/useAppSetup";
import { useTheme } from "@/features/shared/hooks/useTheme";

const RootLayout = () => {
  const loggedIn = useAuthStore((state) => state.loggedIn);
  const theme = useTheme();

  // This hook is used to prevent the splash screen from hiding before the app is fully loaded
  // It is placed here in order not to re-render the app
  useAppSetup();

  if (!loggedIn) {
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
        tabBarButton: (props: PressableProps) => (
          <Pressable
            {...props}
            style={[styles.centerItems, styles.tabBarButton]}
          />
        ),
        tabBarInactiveTintColor: theme?.surfaceForeground + "BB",
        tabBarActiveTintColor: theme?.primaryForeground,
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
  tabBarButton: {
    flex: 1,
    width: "100%",
  },
});
