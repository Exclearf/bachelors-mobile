import * as ImagePicker from "expo-image-picker";
import { useState } from "react";

import { useTranslationStore } from "@/features/translation/stores/translationStore";

import { UseAssetFetcher } from "../misc/types";

const useGalleryAsset = () => {
  const [assetUri, setAssetUri] = useState("");
  const mode = useTranslationStore((state) => state.mode);

  const requestAsset = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: [mode === "textToSign" ? "images" : "videos"],
      allowsEditing: true,
      quality: 1,
      selectionLimit: 1,
    });

    if (!result.canceled) {
      setAssetUri(result.assets[0].uri);
    }
  };

  const resetAssetUri = () => setAssetUri("");

  return { assetUri, resetAssetUri, requestAsset } as UseAssetFetcher;
};

export default useGalleryAsset;
