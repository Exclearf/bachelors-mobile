import { Pressable, StyleSheet } from "react-native";
import React from "react";
import { Tabs } from "expo-router";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Feather from "@expo/vector-icons/Feather";
import Entypo from "@expo/vector-icons/Entypo";
import LoginScreen from "@/features/auth/LoginScreen";
import { useAuthStore } from "@/features/auth/stores/authStore";
import { usePersonalizationStore } from "@/features/settings/stores/personalizationStore";
import { useIsAppLoaded } from "@/features/shared/hooks/useIsAppLoaded";
import { useSplashScreen } from "@/features/shared/hooks/useSplashScreen";

const RootLayout = () => {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

  // This hook is used to prevent the splash screen from hiding before the app is fully loaded
  // It is placed here in order not to re-render the app
  const isAppLoaded = useIsAppLoaded();
  useSplashScreen(isAppLoaded);

  if (!isLoggedIn && false) {
    return <LoginScreen />;
  }

  const theme = usePersonalizationStore((state) => state.theme);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: [
          styles.tabBarStyle,
          { backgroundColor: theme?.background },
        ],
        tabBarItemStyle: styles.centerItems,
        tabBarShowLabel: false,
        tabBarButton: (props) => (
          <Pressable
            {...props}
            style={[styles.centerItems, styles.tabBarButton]}
          />
        ),
        tabBarActiveTintColor: "white",
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
    borderColor: "#5e5e5e",
    borderTopWidth: 2,
    borderWidth: 0,
    height: 60,
  },
  centerItems: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  tabBarButton: { flex: 1, width: "100%" },
});
