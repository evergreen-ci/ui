import { useTransition } from "react";
import styled from "@emotion/styled";
import Button from "@leafygreen-ui/button";
import { useWaterfallAnalytics } from "analytics";
import Icon from "components/Icon";
import { size } from "constants/tokens";
import { WaterfallPagination } from "gql/generated/types";
import { useQueryParams } from "hooks/useQueryParam";
import { WaterfallFilterOptions } from "types/waterfall";

interface PaginationButtonsProps {
  pagination: WaterfallPagination | undefined;
}

export const PaginationButtons: React.FC<PaginationButtonsProps> = ({
  pagination,
}) => {
  const { hasNextPage, hasPrevPage, nextPageOrder, prevPageOrder } =
    pagination ?? {};
  const { sendEvent } = useWaterfallAnalytics();

  const [, startTransition] = useTransition();
  const [queryParams, setQueryParams] = useQueryParams();

  const onNextClick = () => {
    sendEvent({ name: "Changed page", direction: "next" });
    startTransition(() => {
      setQueryParams({
        ...queryParams,
        [WaterfallFilterOptions.MaxOrder]: nextPageOrder,
        [WaterfallFilterOptions.MinOrder]: undefined,
      });
    });
  };

  const onPrevClick = () => {
    sendEvent({
      name: "Changed page",
      direction: "previous",
    });
    startTransition(() => {
      setQueryParams({
        ...queryParams,
        [WaterfallFilterOptions.MaxOrder]: undefined,
        [WaterfallFilterOptions.MinOrder]: prevPageOrder,
      });
    });
  };

  return (
    <Container>
      <Button
        data-cy="prev-page-button"
        disabled={!hasPrevPage}
        leftGlyph={<Icon glyph="ChevronLeft" />}
        onClick={onPrevClick}
      />
      <Button
        data-cy="next-page-button"
        disabled={!hasNextPage}
        leftGlyph={<Icon glyph="ChevronRight" />}
        onClick={onNextClick}
      />
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  gap: ${size.xs};
`;
