import { StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import { Tabs } from "expo-router";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Feather from "@expo/vector-icons/Feather";
import Entypo from "@expo/vector-icons/Entypo";
import { useAuth } from "@/stores/authStore";
import LoginPage from "@/pages/loginPage";

const RootLayout = () => {
  const isLoggedIn = useAuth((state) => state.isLoggedIn);

  if (!isLoggedIn) {
    return <LoginPage />;
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBarStyle,
        tabBarItemStyle: styles.centerItems,
        tabBarShowLabel: false,
        tabBarButton: (props) => (
          //@ts-expect-error TODO: Fix the tabBarButton prop
          <TouchableOpacity
            {...props}
            style={[styles.centerItems, styles.tabBarButton]}
            activeOpacity={1}
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
    backgroundColor: "#1e1e1e",
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
