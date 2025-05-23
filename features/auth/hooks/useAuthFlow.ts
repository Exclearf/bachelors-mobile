import * as AuthSession from "expo-auth-session";
import * as Linking from "expo-linking";
import { router } from "expo-router";
import { useEffect } from "react";
import { useShallow } from "zustand/react/shallow";

import defaultPicture from "@/assets/images/default_user_avatar.png";
import { supabase, useAuthStore } from "@/features/auth/stores/useAuthStore";
import log from "@/features/shared/utils/log";

export { defaultPicture };

export const useAuthFlow = () => {
  const [setUser, setAccessToken, setRefreshToken, setIsLoggedIn] =
    useAuthStore(
      useShallow((state) => [
        state.setUser,
        state.setAccessToken,
        state.setRefreshToken,
        state.setLoggedIn,
      ]),
    );

  const signInWithGoogle = async () => {
    try {
      log.info("Signing in with Google...");
      const redirectUrl = AuthSession.makeRedirectUri({
        scheme: "myapp",
        path: "auth/callback",
      });

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: redirectUrl,
          skipBrowserRedirect: true,
        },
      });

      if (error) {
        log.error("Error during Google Sign-In:", error.message);
        return;
      }

      if (data?.url) {
        await Linking.openURL(data.url);
      }
    } catch (error) {
      log.error("Unexpected error:", error);
    }
  };

  useEffect(() => {
    const handleDeepLink = async (url: string) => {
      log.debug("Deep link received.");
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

            log.info("User logged in.");

            router.replace("/");
          } else {
            log.error("User metadata is missing in the decoded token");
          }
        }
      } catch (error) {
        log.error("Error handling deep link:", error);
      }
    };

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      log.debug("Auth event:", event);

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
  }, [setAccessToken, setIsLoggedIn, setUser, setRefreshToken]);

  return { signInWithGoogle };
};
