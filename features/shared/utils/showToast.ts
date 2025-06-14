import { useTranslation } from "react-i18next";
import { ToastAndroid } from "react-native";

import { UseLocalizationFunction } from "../hooks/useLocalization";

type UseShowToastProps = {
  duration?: number;
  getTranslationKey?: UseLocalizationFunction;
};

const useShowToast = ({
  duration = ToastAndroid.SHORT,
  getTranslationKey,
}: UseShowToastProps = {}) => {
  const { t } = useTranslation();

  const showToast = (translationKey: string) => {
    ToastAndroid.show(
      t(getTranslationKey ? getTranslationKey(translationKey) : translationKey),
      duration,
    );
  };

  return showToast;
};

export default useShowToast;
