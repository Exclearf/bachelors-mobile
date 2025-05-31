import { FlashList } from "@shopify/flash-list";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { ActivityIndicator, RefreshControl } from "react-native";
import { ResizeMode } from "react-native-video";

import ModalWindow from "@/features/shared/components/layout/ModalWindow";
import TextSignTranslation from "@/features/translation/components/textToVideo/feedback/TextSignTranslation";
import { TranslatedTextResponse } from "@/features/translation/utils/types";

import SignPageItem from "./SignPageItem";
import { UseSearchResultFetch } from "../hooks/useSearchResults";

type Props = {
  fetchPage: UseSearchResultFetch;
  searchTerm: string;
};

const SignPage = ({ fetchPage, searchTerm }: Props) => {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
    isRefetching,
  } = useInfiniteQuery({
    queryKey: ["results", searchTerm],
    initialPageParam: 0,
    queryFn: fetchPage,
    getNextPageParam: (lastPage) => lastPage?.currentPage! + 1,
  });

  const pageData = useMemo(
    () => data?.pages.flatMap((page) => page.results) || [],
    [data],
  );

  const [currentItem, setCurrentItem] = useState<TranslatedTextResponse | null>(
    null,
  );

  return (
    <>
      <FlashList
        data={pageData}
        keyExtractor={(item) => item.id!}
        refreshControl={
          <RefreshControl
            tintColor={"blue"}
            refreshing={isRefetching}
            onRefresh={refetch}
          />
        }
        estimatedItemSize={210}
        renderItem={(item) => (
          <SignPageItem item={item.item} setItem={setCurrentItem} />
        )}
        onEndReachedThreshold={0.2}
        onEndReached={() =>
          hasNextPage && !isFetchingNextPage && fetchNextPage()
        }
        ListFooterComponent={
          isFetchingNextPage ? (
            <ActivityIndicator
              color="blue"
              size="small"
              style={{ marginBottom: 5 }}
            />
          ) : null
        }
      />

      <ModalWindow
        isOpen={currentItem != null}
        style={{ height: "50%", width: "90%", overflow: "hidden" }}
      >
        <ModalWindow.Header
          closeCallback={() => setCurrentItem(null)}
          translationKey=""
        />
        <TextSignTranslation
          resizeMode={ResizeMode.CONTAIN}
          activeTextTranslationResult={currentItem!}
        />
      </ModalWindow>
    </>
  );
};

export default SignPage;
