export type AnyFunction = (...args: any) => any;

export type VideoInstance = {
  videoFile: string;
  signType: string;
  dominantStartHandshape: string;
  nonDominantStartHandshape: string;
  dominantEndHandshape: string;
  nonDominantEndHandshape: string;
};

export type GlossTranslation = {
  id?: string;
  gloss: string;
  videoInstances: VideoInstance[];
  isTime: boolean;
  special: boolean;
};
