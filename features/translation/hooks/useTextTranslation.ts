import log from "@/features/shared/utils/log";

const useTextTranslation = (fileUri: string) => {
  const translate = () => {
    log.debug(`Processing the file ${fileUri}`);
  };

  return [translate] as const;
};

export default useTextTranslation;
