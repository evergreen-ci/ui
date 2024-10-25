import styled from "@emotion/styled";
import Button from "@leafygreen-ui/button";
import { useWaterfallAnalytics } from "analytics";
import Icon from "components/Icon";
import { size } from "constants/tokens";
import { useQueryParams } from "hooks/useQueryParam";
import { WaterfallFilterOptions } from "types/waterfall";

interface PaginationButtonsProps {
  nextPageOrder: number;
  prevPageOrder: number;
  onNextPage?: () => void;
  onPrevPage?: () => void;
}
export const PaginationButtons: React.FC<PaginationButtonsProps> = ({
  nextPageOrder,
  onNextPage,
  onPrevPage,
  prevPageOrder,
}) => {
  const { sendEvent } = useWaterfallAnalytics();
  const [queryParams, setQueryParams] = useQueryParams();

  const onNextClick = () => {
    sendEvent({ name: "Changed page", direction: "next" });
    if (onNextPage) {
      onNextPage();
    }
    // it might just refetch and not reference the cache policy
    setQueryParams({
      ...queryParams,
      [WaterfallFilterOptions.MaxOrder]: nextPageOrder,
      [WaterfallFilterOptions.MinOrder]: undefined,
    });
  };

  const onPrevClick = () => {
    sendEvent({
      name: "Changed page",
      direction: "previous",
    });
    if (onPrevPage) {
      onPrevPage();
    }
    setQueryParams({
      ...queryParams,
      [WaterfallFilterOptions.MaxOrder]: undefined,
      [WaterfallFilterOptions.MinOrder]: prevPageOrder,
    });
  };

  return (
    <Container>
      <Button
        data-cy="prev-page-button"
        disabled={prevPageOrder === 0}
        leftGlyph={<Icon glyph="ChevronLeft" />}
        onClick={onPrevClick}
      />
      <Button
        data-cy="next-page-button"
        disabled={nextPageOrder === 0}
        leftGlyph={<Icon glyph="ChevronRight" />}
        onClick={onNextClick}
      />
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  gap: ${size.xs};
  align-self: flex-end;
`;
