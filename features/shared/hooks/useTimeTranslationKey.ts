import { useEffect, useState } from "react";
import { AppState } from "react-native";

import log from "../utils/log";

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
    let interval: number | null = null;

    const handleAppStateChange = (nextAppState: string) => {
      if (nextAppState === "active") {
        log.debug("Setting update translation key interval");
        interval = setInterval(() => {
          log.debug("Updating translation key");
          const newGreetingKey = getTimeBasedKey(keys);
          setTranslationKey((prevKey) =>
            prevKey !== newGreetingKey ? newGreetingKey : prevKey,
          );
        }, 60000);
      } else if (interval) {
        log.debug("Clearing update translation key interval");
        clearInterval(interval);
        interval = null;
      }
    };

    const listener = AppState.addEventListener("change", handleAppStateChange);

    return () => {
      listener.remove();
      if (interval) clearInterval(interval);
    };
  }, [keys]);

  return translationKey;
};
