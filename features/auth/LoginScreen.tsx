import React, { useContext, useEffect } from "react";
import { Image, Pressable, StyleSheet, View } from "react-native";
import Animated, { useAnimatedStyle } from "react-native-reanimated";

import google_logo from "@/assets/images/google_logo.png";
import { useAuthFlow } from "@/features/auth/hooks/useAuthFlow";
import { useLocalization } from "@/features/shared/hooks/useLocalization";

import Button from "../shared/components/input/Button";
import TranslatedText from "../shared/components/text/TranslatedText";
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
      top: (0.93 - bottomSheetHeight / height) * bottomSheetHeight * 0.5,
    };
  });

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.wrapper,
          containerStyle,
          { backgroundColor: theme?.background },
        ]}
      >
        <Animated.View style={[styles.header, headerStyle]}>
          <Pressable
            onPress={() => {
              bottomSheet?.snapToIndex(1);
            }}
          >
            <TranslatedText
              isBold={true}
              fontSizeOverride={34}
              style={[styles.headerText, { color: theme?.primaryForeground }]}
              translationKey={getTranslationKey("signInTitle")}
            />
          </Pressable>
        </Animated.View>
        <View style={styles.content}>
          <Button width={300} height={70} onPress={() => signInWithGoogle()}>
            <View style={styles.buttonContainer}>
              <Image source={google_logo} style={styles.googleLogo} />
              <TranslatedText
                fontSize="medium"
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
  wrapper: {
    position: "absolute",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    width: "100%",
    height: "100%",
  },
  header: {
    position: "absolute",
    width: "100%",
  },
  headerText: { textAlign: "center" },
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
  buttonText: { width: "75%" },
});
