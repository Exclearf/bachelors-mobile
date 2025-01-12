import React, { useContext, useEffect } from "react";
import { Image, Pressable, StyleSheet, View } from "react-native";
import Animated, { useAnimatedStyle } from "react-native-reanimated";
import google_logo from "@/assets/images/google_logo.png";
import TranslatedText from "../shared/components/text/TranslatedText";
import Button from "../shared/components/input/Button";
import { useAuthFlow } from "@/features/auth/hooks/useAuthFlow";
import { useLocalization } from "@/features/shared/hooks/useLocalization";
import { AppDimensionsContext } from "../shared/contexts/appDimensions";
import { useBottomSheet } from "../shared/hooks/useBottomSheet";
import { useTheme } from "../shared/hooks/useTheme";

const LoginScreen = () => {
  const { height } = useContext(AppDimensionsContext);
  const { bottomSheet } = useBottomSheet();
  const { signInWithGoogle } = useAuthFlow();
  const getTranslationKey = useLocalization("loginPage");
  const theme = useTheme();
  useEffect(() => {
    bottomSheet?.expand?.();
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
          {
            backgroundColor: theme?.background,
          },
        ]}
      >
        <Animated.View style={[styles.header, headerStyle]}>
          <Pressable
            onPress={() => {
              bottomSheet?.snapToIndex(1);
            }}
          >
            <TranslatedText
              style={[styles.headerText, { color: theme?.primaryForeground }]}
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
                style={[styles.buttonText, { color: theme?.primaryForeground }]}
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
    width: "100%",
    height: "100%",
  },
  header: {
    position: "absolute",
  },
  headerText: {
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
    fontSize: 18,
    fontWeight: "bold",
  },
});
