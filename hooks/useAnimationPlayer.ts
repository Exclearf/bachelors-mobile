import { useEvent, useEventListener } from "expo";
import { AVPlaybackStatus, AVPlaybackStatusSuccess } from "expo-av";
import { createVideoPlayer } from "expo-video";
import { current } from "immer";
import { useEffect, useState } from "react";

const you = require("@/assets/signs/you-anim.mp4");

const animations = {
  you,
};

const animationNames = Object.keys(animations) as (keyof typeof animations)[];

export const useAnimationPlayer = (
  status: AVPlaybackStatusSuccess,
  ...animationsList: (keyof typeof animations)[]
) => {
  const [currentAnimationIndex, setCurrentAnimationIndex] = useState(0);
  const [hasFinished, setHasFinished] = useState(false);

  const mappedAnimationList = animationsList.map((animationListEntry) => {
    return animations[animationListEntry];
  });

  useEffect(() => {
    if (status?.didJustFinish && !hasFinished) {
      if (currentAnimationIndex + 1 >= animationsList.length) {
        console.log(`RESETTING PLAYBACK`);
        return setHasFinished(true);
      }
      console.log(`Setting Current animation  ${currentAnimationIndex + 1}`);
      setCurrentAnimationIndex(currentAnimationIndex + 1);
    }
  }, [status]);

  const resetPlayback = () => {
    console.log("RESET PLAYBACK");
    setHasFinished(false);
    setCurrentAnimationIndex(0);
  };

  return [
    mappedAnimationList,
    currentAnimationIndex,
    hasFinished,
    resetPlayback,
  ] as const;
};
