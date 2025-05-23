import { useBottomSheet } from "@/features/shared/hooks/useBottomSheet";
import { UseLocalizationFunction } from "@/features/shared/hooks/useLocalization";

import TranslationConfirmation from "./layout/TranslationConfirmation";
import useAssetTranslation from "../../hooks/useAssetTranslation";

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
  const [translate, isFetching, controller, isAborted] = useAssetTranslation(
    assetUri,
    getTranslationKey,
  );

  const { bottomSheet } = useBottomSheet();

  return (
    <>
      <TranslationConfirmation
        fileUri={assetUri}
        getTranslationKey={getTranslationKey}
        isFetching={isFetching}
        cancelCallback={() => {
          if (isFetching) controller.current?.abort("Request aborted.");
          resetAssetUri();
        }}
        acceptCallback={() => {
          const callback = async () => {
            if (isFetching) return;

            await translate();

            if (!isAborted) bottomSheet?.snapToIndex(1);

            resetAssetUri();
          };
          callback();
        }}
      />
    </>
  );
};

export default AssetTranslation;
