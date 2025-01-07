import { useEffect, useState } from "react";
import { AppState } from "react-native";

const getTimeBasedKey = ([morning, afternoon, evening, night]: string[]) => {
  const currentHour = new Date().getHours();

  if (currentHour >= 5 && currentHour < 12) {
    return morning;
  } else if (currentHour >= 12 && currentHour < 18) {
    return afternoon;
  } else if (currentHour >= 18 && currentHour < 22) {
    return evening;
  } else {
    return night;
  }
};

export const useTimeTranslationKey = (
  keys: [string, string, string, string],
) => {
  const [translationKey, setTranslationKey] = useState(getTimeBasedKey(keys));

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    const handleAppStateChange = (nextAppState: string) => {
      if (nextAppState === "active") {
        console.log("Setting update translation key interval");
        interval = setInterval(() => {
          console.log("Updating translation key");
          const newGreetingKey = getTimeBasedKey(keys);
          setTranslationKey((prevKey) =>
            prevKey !== newGreetingKey ? newGreetingKey : prevKey,
          );
        }, 60000);
      } else if (interval) {
        console.log("Clearing update translation key interval");
        clearInterval(interval);
        interval = null;
      }
    };

    const listener = AppState.addEventListener("change", handleAppStateChange);

    return () => {
      listener.remove();
      if (interval) clearInterval(interval);
    };
  }, []);

  return translationKey;
};
