export type UseLocalizationFunction = (key: string) => string;

export const useLocalization = (prefix: string): UseLocalizationFunction => {
  return (key: string) => `${prefix}.${key}`;
};
