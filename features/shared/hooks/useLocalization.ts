export type UseLocalizationFunction = (key: string) => string;

export const useLocalization = (prefix: string) => {
  return (key: string) => `${prefix}.${key}`;
};
