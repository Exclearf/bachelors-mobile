export const fetchWithTimoutWrapper = async (
  url: string,
  options: RequestInit,
  timeout: number,
  controller?: AbortController,
) => {
  setTimeout(() => controller?.abort("The request has timed out."), timeout);

  const resp = await fetch(url, { signal: controller?.signal, ...options });

  return resp;
};

export const fetchWithTimeout = async (
  ...args: [string, RequestInit, number]
) => {
  const controller = new AbortController();

  const response = await fetchWithTimoutWrapper(...args, controller);

  return response;
};
