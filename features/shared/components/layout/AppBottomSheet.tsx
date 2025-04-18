import { PropsWithChildren } from "react";
import { BottomSheetView } from "@gorhom/bottom-sheet";
import AppRoundedPath from "../animated/AppRoundedPath";
import BottomSheetWrapper from "./BottomSheetWrapper";
import { maxBottomPath, minBottomPath } from "../../utils/roundedPathCreators";

type Props = PropsWithChildren<{
    snapPoints: string[];
}>;

const AppBottomSheet = ({ snapPoints, children }: Props) => {
    return (
        <BottomSheetWrapper
            handleStyle={{
                display: "none",
                overflow: "hidden",
            }}
            enableDynamicSizing={false}
            backgroundStyle={{
                display: "none",
            }}
            containerStyle={{
                zIndex: 3,
            }}
            handleComponent={() => (
                <AppRoundedPath
                    zIndex={3}
                    barHeight={30}
                    maxPathCreator={maxBottomPath}
                    minPathCreator={minBottomPath}
                />
            )}
            overDragResistanceFactor={0}
            index={0}
            snapPoints={snapPoints}
        >
            <BottomSheetView style={{ zIndex: 10, flex: 1 }}>
                {children}
            </BottomSheetView>
        </BottomSheetWrapper>
    );
};

export default AppBottomSheet;
