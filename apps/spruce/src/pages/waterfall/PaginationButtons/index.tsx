import styled from "@emotion/styled";
import { Button } from "@leafygreen-ui/button";
import Icon from "@evg-ui/lib/components/Icon";
import { size } from "@evg-ui/lib/constants/tokens";
import { useQueryParam, useQueryParams } from "@evg-ui/lib/hooks";
import { useWaterfallAnalytics } from "analytics";
import { Pagination, WaterfallFilterOptions } from "../types";

interface PaginationButtonsProps {
  pagination: Pagination | undefined;
}

export const PaginationButtons: React.FC<PaginationButtonsProps> = ({
  pagination,
}) => {
  const { sendEvent } = useWaterfallAnalytics();
  const [queryParams, setQueryParams] = useQueryParams();

  const { hasNextPage, hasPrevPage, nextPageOrder, prevPageOrder } =
    pagination ?? {};

  const onNextClick = () => {
    sendEvent({ name: "Changed page", direction: "next" });
    setQueryParams({
      ...queryParams,
      [WaterfallFilterOptions.Date]: undefined,
      [WaterfallFilterOptions.MaxOrder]: nextPageOrder,
      [WaterfallFilterOptions.MinOrder]: undefined,
      [WaterfallFilterOptions.Revision]: undefined,
    });
  };

  const onPrevClick = () => {
    sendEvent({
      name: "Changed page",
      direction: "previous",
    });
    setQueryParams({
      ...queryParams,
      [WaterfallFilterOptions.Date]: undefined,
      [WaterfallFilterOptions.MaxOrder]: undefined,
      [WaterfallFilterOptions.MinOrder]: prevPageOrder,
      [WaterfallFilterOptions.Revision]: undefined,
    });
  };

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
  const navigatingToPage =
    prevPageOrder === minOrder || nextPageOrder === maxOrder;

  return (
    <ButtonContainer>
      <Button
        data-cy="prev-page-button"
        disabled={!hasPrevPage || navigatingToPage}
        leftGlyph={<Icon glyph="ChevronLeft" />}
        onClick={onPrevClick}
      />
      <Button
        data-cy="next-page-button"
        disabled={!hasNextPage || navigatingToPage}
        leftGlyph={<Icon glyph="ChevronRight" />}
        onClick={onNextClick}
      />
    </ButtonContainer>
  );
};

const ButtonContainer = styled.div`
  display: flex;
  gap: ${size.xs};
`;
