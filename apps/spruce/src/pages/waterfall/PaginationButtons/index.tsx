import { Button } from "@via-ds/components";
import ChevronLeft from "@via-ds/icons/ChevronLeft";
import ChevronRight from "@via-ds/icons/ChevronRight";
import { useWaterfallAnalytics } from "analytics";
import { Pagination } from "../types";
import { usePaginationNavigation } from "../usePaginationNavigation";
import styles from "./index.module.css";

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
    <div className={styles.buttonContainer}>
      <Button
        aria-label="Previous page"
        data-testid="prev-page-button"
        isDisabled={!hasPrevPage || isNavigatingToPage}
        onPress={onPrevClick}
      >
        <ChevronLeft />
      </Button>
      <Button
        aria-label="Next page"
        data-testid="next-page-button"
        isDisabled={!hasNextPage || isNavigatingToPage}
        onPress={onNextClick}
      >
        <ChevronRight />
      </Button>
    </div>
  );
};
