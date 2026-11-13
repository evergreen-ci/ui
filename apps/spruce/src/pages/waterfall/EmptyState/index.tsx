import { BasicEmptyState, Button, Text } from "@via-ds/components";
import { useWaterfallAnalytics } from "analytics";
import { VERSION_SEARCH_LIMIT } from "../constants";
import { Pagination } from "../types";
import { usePaginationNavigation } from "../usePaginationNavigation";
import { EmptyGraphic } from "./EmptyGraphic";
import styles from "./index.module.css";

interface EmptyStateProps {
  pagination: Pagination;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ pagination }) => {
  const { sendEvent } = useWaterfallAnalytics();
  const { goToNextPage, hasNextPage, isNavigatingToPage } =
    usePaginationNavigation(pagination);

  if (hasNextPage) {
    return (
      <BasicEmptyState
        className={styles.emptyState}
        data-testid="waterfall-empty-state"
      >
        <div className={styles.graphic} slot="graphic">
          <EmptyGraphic />
        </div>
        <Text slot="title">No Results Found</Text>
        <Text slot="description">
          {`Evergreen found no builds matching the applied filters in the ${VERSION_SEARCH_LIMIT} commits searched. Older commits may still contain matching builds.`}
        </Text>
        <Button
          data-testid="search-older-commits-button"
          isDisabled={isNavigatingToPage}
          onPress={() => {
            sendEvent({ name: "Clicked search older commits button" });
            goToNextPage();
          }}
          slot="primaryAction"
        >
          Search older commits
        </Button>
      </BasicEmptyState>
    );
  }

  return (
    <BasicEmptyState className={styles.emptyState}>
      <div className={styles.graphic} slot="graphic">
        <EmptyGraphic />
      </div>
      <Text slot="title">No Results Found</Text>
      <Text slot="description">
        Evergreen found no builds matching the applied filters.
      </Text>
    </BasicEmptyState>
  );
};
