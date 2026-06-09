import { useQueryParam, useQueryParams } from "@evg-ui/lib/hooks";
import { Pagination, WaterfallFilterOptions } from "./types";

export const usePaginationNavigation = (pagination: Pagination | undefined) => {
  const [queryParams, setQueryParams] = useQueryParams();

  const { hasNextPage, hasPrevPage, nextPageOrder, prevPageOrder } =
    pagination ?? {};

  // Use nullable types here so that we can accurately disable buttons during navigation
  const [maxOrder] = useQueryParam<number | null>(
    WaterfallFilterOptions.MaxOrder,
    null,
  );
  const [minOrder] = useQueryParam<number | null>(
    WaterfallFilterOptions.MinOrder,
    null,
  );

  // If the query param is equivalent to the current pagination value, this means we are fetching and the new pagination data hasn't yet been returned.
  // During this time, disable pagination buttons.
  const isNavigatingToPage =
    prevPageOrder === minOrder || nextPageOrder === maxOrder;

  const goToNextPage = () => {
    setQueryParams({
      ...queryParams,
      [WaterfallFilterOptions.Date]: undefined,
      [WaterfallFilterOptions.MaxOrder]: nextPageOrder,
      [WaterfallFilterOptions.MinOrder]: undefined,
      [WaterfallFilterOptions.Revision]: undefined,
    });
  };

  const goToPrevPage = () => {
    setQueryParams({
      ...queryParams,
      [WaterfallFilterOptions.Date]: undefined,
      [WaterfallFilterOptions.MaxOrder]: undefined,
      [WaterfallFilterOptions.MinOrder]: prevPageOrder,
      [WaterfallFilterOptions.Revision]: undefined,
    });
  };

  return {
    goToNextPage,
    goToPrevPage,
    hasNextPage,
    hasPrevPage,
    isNavigatingToPage,
  };
};
