const useTextTranslation = (fileUri: string) => {
  const translate = () => console.log(`Processing the file ${fileUri}`);

  return [translate] as const;
};

export default useTextTranslation;
