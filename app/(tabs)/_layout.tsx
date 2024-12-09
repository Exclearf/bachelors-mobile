import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { Tabs } from "expo-router";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Feather from "@expo/vector-icons/Feather";
import Entypo from "@expo/vector-icons/Entypo";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
type Props = {};
const RootLayout = (props: Props) => {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#1e1e1e",
          display: "flex",
        },
        tabBarButton: (props) => (
          //@ts-ignore
          <TouchableOpacity {...props} activeOpacity={1} />
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

const styles = StyleSheet.create({});
