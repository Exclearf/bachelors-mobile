import React, { useEffect } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { createClient } from "@supabase/supabase-js";
import { useAuth } from "@/stores/authStore";
import { useShallow } from "zustand/react/shallow";

import * as Linking from "expo-linking";
import { router } from "expo-router";

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY =
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

type Props = {};

const LoginPage = (props: Props) => {
  const [user, setUser, setAccessToken, setLoggedIn] = useAuth(
    useShallow((state) => [
      state.user,
      state.setUser,
      state.setAccessToken,
      state.setIsLoggedIn,
    ]),
  );
  const signInWithGoogle = async () => {
    try {
      console.log("Signing in with Google...");

      const redirectUrl = Linking.createURL("auth/callback");
      console.log("Redirect URL:", redirectUrl);

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: "yourapp://auth/callback",
          skipBrowserRedirect: true,
        },
      });

      if (error) {
        console.error("Error during Google Sign-In:", error.message);
        return;
      }

      if (data?.url) {
        Linking.openURL(data.url);
      }
    } catch (error) {
      console.error("Unexpected error:", error);
    }
  };

  useEffect(() => {
    const handleDeepLink = async (url: string) => {
      console.log("Received deep link:", url);

      const fragment = url.split("#")[1];
      const queryParams = Object.fromEntries(new URLSearchParams(fragment));
      console.log("Parsed queryParams:", queryParams);

      const { access_token, refresh_token } = queryParams;

      if (access_token) {
        const decodedToken = JSON.parse(atob(access_token.split(".")[1]));
        const userMetadata = decodedToken.user_metadata;

        if (userMetadata) {
          useAuth.getState().setUser({
            name: userMetadata.full_name || "Unknown",
            email: userMetadata.email || "Unknown",
            picture: userMetadata.picture || null,
          });

          useAuth.getState().setAccessToken(access_token);
          useAuth.getState().setIsLoggedIn(true);

          console.log("User set in Zustand:", userMetadata);

          router.replace("/");
        } else {
          console.error("User metadata is missing in the decoded token");
        }
      } else {
      }
    };
    const subscription = Linking.addEventListener("url", (event) => {
      handleDeepLink(event.url);
    });

    Linking.getInitialURL().then((url) => {
      if (url) {
        handleDeepLink(url);
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Log in</Text>
      </View>
      <View style={styles.content}>
        <Pressable onPress={signInWithGoogle} style={styles.loginButton}>
          <Text style={styles.buttonText}>Log In with Google</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default LoginPage;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#1e1e1e",
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    marginBottom: 20,
  },
  headerText: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
  },
  content: {
    width: "100%",
    alignItems: "center",
  },
  loginButton: {
    backgroundColor: "#4285F4",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
