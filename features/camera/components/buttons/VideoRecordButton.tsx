import React from "react";

import RecordButton from "./RecordButton";
import { CameraOverlayButtonProps } from "../../CameraOverlay";
import { useCameraOptionsStore } from "../../stores/useCameraOptionsStore";

const VideoRecordButton = (props: CameraOverlayButtonProps) => {
  const isRecording = useCameraOptionsStore((state) => state.isFetching);

  return (
    <RecordButton
      {...props}
      iconName={isRecording ? "stop-circle" : "record-circle"}
    />
  );
};

export default VideoRecordButton;
