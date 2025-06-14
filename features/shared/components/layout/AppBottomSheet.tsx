import { BottomSheetView } from "@gorhom/bottom-sheet";
import { PropsWithChildren } from "react";

import BottomSheetWrapper from "./BottomSheetWrapper";
import { maxBottomPath, minBottomPath } from "../../utils/svgPathCreators";
import AppRoundedPath from "../primitive/AppRoundedPath";

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
      backgroundStyle={{ display: "none" }}
      containerStyle={{ zIndex: 3 }}
      handleComponent={() => (
        <AppRoundedPath
          zIndex={2}
          barHeight={30}
          maxPathCreator={maxBottomPath}
          minPathCreator={minBottomPath}
        />
      )}
      overDragResistanceFactor={0}
      index={0}
      snapPoints={snapPoints}
    >
      <BottomSheetView
        style={{
          zIndex: 2,
          flex: 1,
          height: "100%",
        }}
      >
        {children}
      </BottomSheetView>
    </BottomSheetWrapper>
  );
};

export default AppBottomSheet;
