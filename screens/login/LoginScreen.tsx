import React, { useContext, useEffect } from "react";
import { Image, Pressable, StyleSheet, View } from "react-native";
import Button from "@/components/common/Button";
import { useBottomSheet } from "@/hooks/useBottomSheet";
import Animated, { useAnimatedStyle } from "react-native-reanimated";
import { AppDimensionsContext } from "@/contexts/appDimensions";
import { useAuthFlow } from "@/hooks/useAuthFlow";
import { useLocalization } from "@/hooks/useLocalization";
import TranslatedText from "@/components/common/TranslatedText";
import google_logo from "@/assets/images/google_logo.png";

const LoginScreen = () => {
  const { height } = useContext(AppDimensionsContext);
  const { bottomSheet } = useBottomSheet();
  const { signInWithGoogle } = useAuthFlow();
  const getTranslationKey = useLocalization("loginPage");

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
            <TranslatedText
              style={styles.headerText}
              translationKey={getTranslationKey("signInTitle")}
            />
          </Pressable>
        </Animated.View>
        <View style={styles.content}>
          <Button
            width={300}
            height={70}
            backgroundColor="rgba(255,255,255,0.1)"
            onPress={() => signInWithGoogle()}
          >
            <View style={styles.buttonContainer}>
              <Image source={google_logo} style={styles.googleLogo}></Image>
              <TranslatedText
                style={styles.buttonText}
                translationKey={getTranslationKey("signInWithGoogle")}
              />
            </View>
          </Button>
        </View>
      </Animated.View>
    </View>
  );
};

export default LoginScreen;

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
