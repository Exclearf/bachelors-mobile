export const useLocalization = (prefix: string) => {
  return (key: string) => `${prefix}.${key}`;
};
