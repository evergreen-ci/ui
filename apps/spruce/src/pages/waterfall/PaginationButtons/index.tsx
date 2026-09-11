import styled from "@emotion/styled";
import { Button } from "@leafygreen-ui/button";
import ChevronLeft from "@via-ds/icons/ChevronLeft";
import ChevronRight from "@via-ds/icons/ChevronRight";
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
        data-testid="prev-page-button"
        disabled={!hasPrevPage || isNavigatingToPage}
        leftGlyph={<ChevronLeft />}
        onClick={onPrevClick}
      />
      <Button
        data-testid="next-page-button"
        disabled={!hasNextPage || isNavigatingToPage}
        leftGlyph={<ChevronRight />}
        onClick={onNextClick}
      />
    </ButtonContainer>
  );
};

const ButtonContainer = styled.div`
  display: flex;
  gap: ${size.xs};
`;
