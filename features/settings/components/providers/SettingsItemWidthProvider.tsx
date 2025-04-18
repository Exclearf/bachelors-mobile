import React, { PropsWithChildren } from "react";
import { useAppDimensions } from "@/features/shared/hooks/useAppDimensions";
import { SettingsItemWidthContext } from "../../contexts/settingsItemWidth";

type Props = PropsWithChildren<{}>;

const SettingsItemWidthProvider = ({ children }: Props) => {
    const { width } = useAppDimensions();

    return (
        <SettingsItemWidthContext.Provider value={{ width: width * 0.55 }}>
            {children}
        </SettingsItemWidthContext.Provider>
    );
};

export default SettingsItemWidthProvider;
