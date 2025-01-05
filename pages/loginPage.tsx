import React, { useContext, useEffect } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import Button from "@/components/utils/Button";
import { useBottomSheet } from "@/hooks/useBottomSheet";
import Animated, { useAnimatedStyle } from "react-native-reanimated";
import { AppDimensionsContext } from "@/contexts/appDimensions";
import { useAuthFlow } from "@/hooks/useAuthFlow";

const google_logo = require("@/assets/images/google_logo.png");

const LoginPage = () => {
  const { height } = useContext(AppDimensionsContext);
  const { bottomSheet } = useBottomSheet();
  const { signInWithGoogle } = useAuthFlow();

  useEffect(() => {
    bottomSheet?.snapToIndex(1);
  }, [bottomSheet]);

  const containerStyle = useAnimatedStyle(() => {
    "worklet";
    const minHeight = height * 0.55;
    return {
      height: Math.max(
        height - (bottomSheet?.animatedPosition.get() ?? 0),
        minHeight,
      ),
    };
  });

  const headerStyle = useAnimatedStyle(() => {
    "worklet";
    const bottomSheetHeight = bottomSheet?.animatedPosition.get() ?? 0;
    return {
      top: (0.9 - bottomSheetHeight / height) * bottomSheetHeight * 0.5,
    };
  });

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          {
            position: "absolute",
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
          },
          containerStyle,
        ]}
      >
        <Animated.View style={[styles.header, headerStyle]}>
          <Pressable
            onPress={() => {
              bottomSheet?.snapToIndex(1);
            }}
          >
            <Text style={styles.headerText}>Log in</Text>
          </Pressable>
        </Animated.View>
        <View style={styles.content}>
          <Button
            width={250}
            height={70}
            backgroundColor="transparent"
            onPress={() => signInWithGoogle()}
          >
            <View style={styles.buttonContainer}>
              <Image source={google_logo} style={styles.googleLogo}></Image>
              <Text style={styles.buttonText}>Log In with Google</Text>
            </View>
          </Button>
        </View>
      </Animated.View>
    </View>
  );
};

export default LoginPage;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#1e1e1e",
    width: "100%",
    height: "100%",
  },
  header: {
    position: "absolute",
  },
  headerText: {
    color: "#fff",
    fontSize: 34,
    fontWeight: "bold",
    textAlign: "center",
  },
  content: {
    width: "100%",
    paddingBottom: 35,
    alignItems: "center",
  },
  buttonContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
  },
  googleLogo: {
    width: 35,
    height: 35,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
