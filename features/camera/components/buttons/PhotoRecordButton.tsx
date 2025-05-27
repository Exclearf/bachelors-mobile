import React from "react";

import RecordButton from "./RecordButton";
import { CameraOverlayButtonProps } from "../../CameraOverlay";

const PhotoRecordButton = (props: CameraOverlayButtonProps) => {
  return <RecordButton {...props} />;
};

export default PhotoRecordButton;
