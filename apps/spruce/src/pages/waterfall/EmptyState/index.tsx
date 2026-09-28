import { BasicEmptyState, Button, Text } from "@via-ds/components";
import { useQueryParam } from "@evg-ui/lib/hooks";
import { useWaterfallAnalytics } from "analytics";
import { VERSION_SEARCH_LIMIT } from "../constants";
import { Pagination, WaterfallFilterOptions } from "../types";
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

  const [tasks] = useQueryParam<string[]>(WaterfallFilterOptions.Task, []);
  const [statuses] = useQueryParam<string[]>(
    WaterfallFilterOptions.Statuses,
    [],
  );
  // Task and status filters are only searched within a limited window of commits;
  // other filters search the project's entire history in one query.
  const searchIsWindowLimited = tasks.length > 0 || statuses.length > 0;

  if (searchIsWindowLimited && hasNextPage) {
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
