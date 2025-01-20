import React, { useState } from "react";
import Select, {
  SelectItemType,
} from "@/features/shared/components/input/Select";
import SettingsMenuEntryText from "../../shared/SettingsMenuEntryText";
import { SettingsSectionSubItemType } from "@/features/settings/SettingsSections";
import { useSettingsItemWidth } from "@/features/settings/hooks/useSettingsItemWidth";
import { useLocalization } from "@/features/shared/hooks/useLocalization";
import {
  AvailableModels,
  Model,
  useTranslationStore,
} from "@/features/translation/stores/translationStore";

type Props = SettingsSectionSubItemType;

const ModelSelect = ({ getTranslationKey, textStyle }: Props) => {
  const { width } = useSettingsItemWidth();
  const setModel = useTranslationStore((state) => state.setModel);
  const modelSelectionTranslationKey = useLocalization(
    getTranslationKey("modelSelectOptions"),
  );

  const mockSelectData = [
    {
      key: "placeholder",
      isPlaceholder: true,
    },
    ...Object.values(AvailableModels).map((model) => ({
      key: model,
      isPlaceholder: false,
    })),
  ];

  const [currentItem, setCurrentItem] = useState<SelectItemType | null>(null);

  const handleChange = (item: SelectItemType) => {
    setCurrentItem(item);
    setModel(item.id as Model);
  };

  return (
    <>
      <SettingsMenuEntryText
        textStyle={textStyle}
        textTranslationKey={getTranslationKey("modelSelect")}
      />
      <Select
        width={width}
        items={mockSelectData.map((item) => ({
          translationKey: modelSelectionTranslationKey(item.key),
          id: item.key,
          isPlaceholder: item.isPlaceholder,
        }))}
        currentItem={currentItem}
        setCurrentItem={handleChange}
      />
    </>
  );
};

export default ModelSelect;
