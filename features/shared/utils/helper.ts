export const percentageToDecimal = (percentage: string): number =>
  parseFloat(percentage) / 100;

export const debounce = <F extends (...args: any[]) => any>(
  func: F,
  wait: number,
) => {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  return (...args: Parameters<F>) => {
    if (timeoutId !== null) clearTimeout(timeoutId);

    timeoutId = setTimeout(() => {
      func(...args);
    }, wait);
  };
};
