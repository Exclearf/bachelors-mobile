import { useTranslation } from "react-i18next";
import { ToastAndroid } from "react-native";

const useShowToast = (duration: number = ToastAndroid.SHORT) => {
  const { t } = useTranslation();

  const showToast = (translationKey: string) => {
    ToastAndroid.show(t(translationKey), duration);
  };

  return showToast;
};

export default useShowToast;
