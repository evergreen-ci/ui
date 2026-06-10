import { Button } from "@leafygreen-ui/button";
import { BasicEmptyState } from "@leafygreen-ui/empty-state";
import { useQueryParam } from "@evg-ui/lib/hooks";
import { useWaterfallAnalytics } from "analytics";
import { VERSION_SEARCH_LIMIT } from "../constants";
import { Pagination, WaterfallFilterOptions } from "../types";
import { usePaginationNavigation } from "../usePaginationNavigation";
import { EmptyGraphic } from "./EmptyGraphic";

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
        description={`Evergreen found no builds matching the applied filters in the ${VERSION_SEARCH_LIMIT} commits searched. Older commits may still contain matching builds.`}
        graphic={<EmptyGraphic />}
        primaryButton={
          <Button
            data-cy="search-older-commits-button"
            disabled={isNavigatingToPage}
            onClick={() => {
              sendEvent({ name: "Clicked search older commits button" });
              goToNextPage();
            }}
          >
            Search older commits
          </Button>
        }
        title="No Results Found"
      />
    );
  }

  return (
    <BasicEmptyState
      description="Evergreen found no builds matching the applied filters."
      graphic={<EmptyGraphic />}
      title="No Results Found"
    />
  );
};
