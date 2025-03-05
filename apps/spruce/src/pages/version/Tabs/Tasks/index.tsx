import { useEffect } from "react";
import { useQuery } from "@apollo/client";
import { useLocation } from "react-router";
import { useToastContext } from "@evg-ui/lib/context/toast";
import { useVersionAnalytics } from "analytics";
import TableControl from "components/Table/TableControl";
import TableWrapper from "components/Table/TableWrapper";
import { DEFAULT_POLL_INTERVAL } from "constants/index";
import { PaginationQueryParams } from "constants/queryParams";
import {
  VersionTasksQuery,
  VersionTasksQueryVariables,
} from "gql/generated/types";
import { VERSION_TASKS } from "gql/queries";
import { usePolling } from "hooks";
import { useUpdateURLQueryParams } from "hooks/useUpdateURLQueryParams";
import { PatchTasksQueryParams } from "types/task";
import { parseQueryString } from "utils/queryString";
import { useQueryVariables } from "../useQueryVariables";
import { PatchTasksTable } from "./PatchTasksTable";

const defaultSortMethod = "STATUS:ASC;BASE_STATUS:DESC";

interface Props {
  taskCount: number;
  versionId: string;
}

const Tasks: React.FC<Props> = ({ taskCount, versionId }) => {
  const dispatchToast = useToastContext();
  const { search } = useLocation();
  const updateQueryParams = useUpdateURLQueryParams();
  const versionAnalytics = useVersionAnalytics(versionId || "");
  const queryVariables = useQueryVariables(search, versionId || "");
  const hasQueryVariables = Object.keys(parseQueryString(search)).length > 0;
  const { limit, page, sorts } = queryVariables.taskFilterOptions;

  useEffect(() => {
    updateQueryParams({
      // @ts-expect-error: FIXME. This comment was added by an automated script.
      [PatchTasksQueryParams.Duration]: undefined,
      [PatchTasksQueryParams.Sorts]: defaultSortMethod,
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const clearQueryParams = () => {
    updateQueryParams({
      // @ts-expect-error: FIXME. This comment was added by an automated script.
      [PatchTasksQueryParams.TaskName]: undefined,
      // @ts-expect-error: FIXME. This comment was added by an automated script.
      [PatchTasksQueryParams.Variant]: undefined,
      // @ts-expect-error: FIXME. This comment was added by an automated script.
      [PatchTasksQueryParams.Statuses]: undefined,
      // @ts-expect-error: FIXME. This comment was added by an automated script.
      [PatchTasksQueryParams.BaseStatuses]: undefined,
      // @ts-expect-error: FIXME. This comment was added by an automated script.
      [PaginationQueryParams.Page]: undefined,
      // @ts-expect-error: FIXME. This comment was added by an automated script.
      [PatchTasksQueryParams.Duration]: undefined,
      [PatchTasksQueryParams.Sorts]: defaultSortMethod,
    });
    versionAnalytics.sendEvent({
      name: "Deleted all filters",
    });
  };

  const { data, loading, refetch, startPolling, stopPolling } = useQuery<
    VersionTasksQuery,
    VersionTasksQueryVariables
  >(VERSION_TASKS, {
    variables: queryVariables,
    pollInterval: DEFAULT_POLL_INTERVAL,
    skip: !hasQueryVariables,
    fetchPolicy: "cache-and-network",
    onError: (err) => {
      dispatchToast.error(`Error fetching patch tasks ${err}`);
    },
  });
  usePolling({ startPolling, stopPolling, refetch });
  const { version } = data || {};
  const { isPatch, tasks } = version || {};
  const { count = 0, data: tasksData = [] } = tasks || {};

  return (
    <TableWrapper
      controls={
        <TableControl
          filteredCount={count}
          label="tasks"
          // @ts-expect-error: FIXME. This comment was added by an automated script.
          limit={limit}
          onClear={clearQueryParams}
          onPageSizeChange={(l) => {
            versionAnalytics.sendEvent({
              name: "Changed page size",
              "page.size": l,
            });
          }}
          // @ts-expect-error: FIXME. This comment was added by an automated script.
          page={page}
          totalCount={taskCount}
        />
      }
      shouldShowBottomTableControl={tasksData.length > 10}
    >
      <PatchTasksTable
        // @ts-expect-error: FIXME. This comment was added by an automated script.
        isPatch={isPatch}
        loading={tasksData.length === 0 && loading}
        // @ts-expect-error: FIXME. This comment was added by an automated script.
        sorts={sorts}
        tasks={tasksData}
      />
    </TableWrapper>
  );
};

export default Tasks;
