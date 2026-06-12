import styled from "@emotion/styled";
import { Button } from "@leafygreen-ui/button";
import Icon from "@evg-ui/lib/components/Icon";
import { size } from "@evg-ui/lib/constants/tokens";
import { useWaterfallAnalytics } from "analytics";
import { Pagination } from "../types";
import { usePaginationNavigation } from "../usePaginationNavigation";

interface PaginationButtonsProps {
  pagination: Pagination | undefined;
}

export const PaginationButtons: React.FC<PaginationButtonsProps> = ({
  pagination,
}) => {
  const { sendEvent } = useWaterfallAnalytics();
  const {
    goToNextPage,
    goToPrevPage,
    hasNextPage,
    hasPrevPage,
    isNavigatingToPage,
  } = usePaginationNavigation(pagination);

  const onNextClick = () => {
    sendEvent({ name: "Changed page", direction: "next" });
    goToNextPage();
  };

  const onPrevClick = () => {
    sendEvent({
      name: "Changed page",
      direction: "previous",
    });
    goToPrevPage();
  };

  return (
    <ButtonContainer>
      <Button
        data-cy="prev-page-button"
        disabled={!hasPrevPage || isNavigatingToPage}
        leftGlyph={<Icon glyph="ChevronLeft" />}
        onClick={onPrevClick}
      />
      <Button
        data-cy="next-page-button"
        disabled={!hasNextPage || isNavigatingToPage}
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
