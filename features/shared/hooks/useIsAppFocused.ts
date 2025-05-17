import { useEffect, useState } from "react";
import { AppState } from "react-native";

const useIsAppFocused = () => {
  const [appState, setAppState] = useState(AppState.currentState);

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      setAppState(nextAppState);
    });

    return () => {
      subscription.remove();
    };
  }, []);

  return appState === "active";
};

export default useIsAppFocused;
