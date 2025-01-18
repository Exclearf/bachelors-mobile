import { useEffect } from "react";
import * as Linking from "expo-linking";
import { router } from "expo-router";
import { useShallow } from "zustand/react/shallow";
import defaultPicture from "@/assets/images/default_user_avatar.png";
import { supabase, useAuthStore } from "@/features/auth/stores/authStore";

export { defaultPicture };

export const useAuthFlow = () => {
  const [setUser, setAccessToken, setRefreshToken, setIsLoggedIn] =
    useAuthStore(
      useShallow((state) => [
        state.setUser,
        state.setAccessToken,
        state.setRefreshToken,
        state.setIsLoggedIn,
      ]),
    );

  const signInWithGoogle = async () => {
    try {
      console.log("Signing in with Google...");
      const redirectUrl = Linking.createURL("auth/callback");

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: redirectUrl,
          skipBrowserRedirect: false,
        },
      });

      if (error) {
        console.error("Error during Google Sign-In:", error.message);
        return;
      }

      if (data?.url) {
        await Linking.openURL(data.url);
      }
    } catch (error) {
      console.error("Unexpected error:", error);
    }
  };

  const handleDeepLink = async (url: string) => {
    console.log("Deep link received: " + url);
    try {
      const { access_token, refresh_token } = Object.fromEntries(
        new URLSearchParams(url.split("#")[1]),
      );

      if (access_token && refresh_token) {
        const decodedToken = JSON.parse(atob(access_token.split(".")[1]));
        const userMetadata = decodedToken.user_metadata;

        if (userMetadata) {
          setUser({
            name: userMetadata.full_name,
            email: userMetadata.email || "Unknown",
            picture: userMetadata.picture
              ? { uri: userMetadata.picture }
              : defaultPicture,
          });
          setAccessToken(access_token);
          setRefreshToken(refresh_token);
          setIsLoggedIn(true);

          router.replace("/");
        } else {
          console.error("User metadata is missing in the decoded token");
        }
      }
    } catch (error) {
      console.error("Error handling deep link:", error);
    }
  };

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth event:", event);

      if (session && (event === "SIGNED_IN" || event === "TOKEN_REFRESHED")) {
        setAccessToken(session.access_token);
        setRefreshToken(session.refresh_token);

        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (user?.user_metadata) {
          setUser({
            name: user.user_metadata.full_name || "Unknown",
            email: user.email || "Unknown",
            picture: user.user_metadata.picture || null,
          });
        }
        setIsLoggedIn(true);
      }

      if (event === "SIGNED_OUT") {
        setIsLoggedIn(false);
        setUser(null);
        setAccessToken(null);
        setRefreshToken(null);
      }
    });

    const linkingSubscription = Linking.addEventListener("url", (event) => {
      handleDeepLink(event.url);
    });

    Linking.getInitialURL().then((url) => {
      if (url) {
        handleDeepLink(url);
      }
    });

    return () => {
      subscription.unsubscribe();
      linkingSubscription.remove();
    };
  }, []);

  return {
    signInWithGoogle,
  };
};
