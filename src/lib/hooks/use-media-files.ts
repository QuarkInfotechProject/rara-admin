import axios from "axios";
import { useInView } from "framer-motion";
import React, { useEffect, useRef } from "react";
import { PaginatedResponse } from "@/types/index.types";
import { File } from "@/types/media.types";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useMediaFilter } from "../context/media-filter-context";

function useMediaFiles() {
  const { search, sortBy, category } = useMediaFilter();
  const { data, isFetching, fetchNextPage, hasNextPage } = useInfiniteQuery<PaginatedResponse<File>>({
    queryKey: ["file-selector", search, sortBy, category],
    queryFn: async ({ pageParam }) => {
      const { data } = await axios.post(
        "/api/files",
        {
          fileCategoryId: category === "all" ? "" : category,
          fileName: search,
          sortBy: sortBy.split(".")?.[0] || "",
          sortDirection: sortBy.split(".")?.[1] || "",
        },
        {
          params: {
            page: pageParam,
          },
        }
      );
      return data;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => (lastPage.data.next_page_url ? lastPage.data.current_page + 1 : undefined),
    getPreviousPageParam: (lastPage) => (lastPage.data.prev_page_url ? lastPage.data.current_page - 1 : undefined),
  });
  const allFiles = data?.pages.flatMap((page) => page.data.data);
  const loadMoreTriggerRef = useRef<HTMLDivElement>(null);
  const loadMore = useInView(loadMoreTriggerRef, {
    amount: 0.1,
  });

  useEffect(() => {
    if (loadMore && hasNextPage && !isFetching) {
      fetchNextPage();
    }
  }, [loadMore, hasNextPage, isFetching, fetchNextPage]);

  return { files: allFiles, loadMoreTriggerRef, isFetching, loadMore, hasNextPage, fetchNextPage };
}

export { useMediaFiles };
