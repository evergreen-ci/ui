import styled from "@emotion/styled";
import Button from "@leafygreen-ui/button";
import { size } from "@evg-ui/lib/constants/tokens";
import { useWaterfallAnalytics } from "analytics";
import Icon from "components/Icon";
import { WaterfallPagination } from "gql/generated/types";
import { useQueryParams } from "hooks/useQueryParam";
import { WaterfallFilterOptions } from "../types";

interface PaginationButtonsProps {
  pagination: WaterfallPagination | undefined;
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
    });
  };

  return (
    <ButtonContainer>
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
    </ButtonContainer>
  );
};

const ButtonContainer = styled.div`
  display: flex;
  gap: ${size.xs};
`;
