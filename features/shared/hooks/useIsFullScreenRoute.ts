import { useSegments } from "expo-router";

export const useIsFullScreenRoute = () => {
  const activeRoute = useSegments()[1];
  const fullScreenRoutes = ["study", "settings"];
  const isFullScreenRoute = fullScreenRoutes.includes(activeRoute!);

  return isFullScreenRoute;
};
