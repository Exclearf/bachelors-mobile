import { UseLocalizationFunction } from "@/features/shared/hooks/useLocalization";

import TranslationConfirmation from "./layout/TranslationConfirmation";
import useAssetTranslation from "../hooks/useAssetTranslation";

type TextTranslationProps = {
  assetUri: string;
  resetAssetUri: () => void;
  getTranslationKey: UseLocalizationFunction;
};

const AssetTranslation = ({
  assetUri,
  resetAssetUri,
  getTranslationKey,
}: TextTranslationProps) => {
  const [translate, isFetching, controller] = useAssetTranslation(
    assetUri,
    getTranslationKey,
  );

  return (
    <>
      <TranslationConfirmation
        fileUri={assetUri}
        getTranslationKey={getTranslationKey}
        cancelCallback={() => {
          if (isFetching) controller.current?.abort("Request aborted.");
          resetAssetUri();
        }}
        acceptCallback={() => {
          const callback = async () => {
            if (isFetching) return;

            await translate();
            resetAssetUri();
          };
          callback();
        }}
      />
    </>
  );
};

export default AssetTranslation;
