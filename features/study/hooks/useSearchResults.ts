import { useCallback, useRef } from "react";
import uuid from "react-native-uuid";

import { useAuthStore } from "@/features/auth/stores/useAuthStore";
import { fetchWithTimoutWrapper } from "@/features/shared/utils/fetch";
import log from "@/features/shared/utils/log";

import { SignPageResult } from "../types/types";

type FetchArg = {
  pageParam: number;
  queryKey: unknown[];
};

export type UseSearchResultFetch = (param: FetchArg) => Promise<SignPageResult>;

const useSearchResults = () => {
  const controller = useRef<AbortController | undefined>(undefined);
  const accessToken = useAuthStore((state) => state.accessToken);

  const fetchResults = useCallback(
    (async ({ pageParam = 0, queryKey }) => {
      if (controller.current) controller.current.abort();

      const searchTerm = queryKey[1] ?? null;
      controller.current = new AbortController();

      log.debug(`Fetching page ${searchTerm}:${pageParam} `);

      const uri = `https://bachelors.encape.me/api/translate/videos/${pageParam}${
        searchTerm != null && searchTerm !== "" ? "?search=" + searchTerm : ""
      }`;

      const response = await fetchWithTimoutWrapper(
        uri,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
        5000,
        controller.current,
      );

      if (response.status === 400) {
        log.warn(`Request for ${uri} has failed.`);

        return;
      }

      const json = await response.json();

      controller.current = undefined;

      json.currentPage = parseInt(
        response.headers.get("X-Pagination-Current-Page") ?? "0",
      );

      const signPageResult = json as SignPageResult;

      signPageResult.results.map((item) => (item.id = uuid.v4()));

      return signPageResult;
    }) as UseSearchResultFetch,
    [accessToken],
  );

  return [fetchResults] as const;
};

export default useSearchResults;
