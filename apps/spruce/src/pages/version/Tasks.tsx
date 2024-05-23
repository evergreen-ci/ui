import { useEffect } from "react";
import { useQuery } from "@apollo/client";
import { useParams } from "react-router-dom";
import { useVersionAnalytics } from "analytics";
import TableControl from "components/Table/TableControl";
import TableWrapper from "components/Table/TableWrapper";
import { DEFAULT_POLL_INTERVAL } from "constants/index";
import { PaginationQueryParams } from "constants/queryParams";
import { slugs } from "constants/routes";
import { useToastContext } from "context/toast";
import {
  VersionTasksQuery,
  VersionTasksQueryVariables,
} from "gql/generated/types";
import { VERSION_TASKS } from "gql/queries";
import { usePolling } from "hooks";
import { useQueryParams } from "hooks/useQueryParam";
import { PatchTasksQueryParams } from "types/task";
import { PatchTasksTable } from "./tasks/PatchTasksTable";
import useVersionTasksQueryVariables from "./useVersionTasksQueryVariables";

const defaultSortMethod = "STATUS:ASC;BASE_STATUS:DESC";

interface Props {
  taskCount: number;
}

export const Tasks: React.FC<Props> = ({ taskCount }) => {
  const dispatchToast = useToastContext();
  const { [slugs.versionId]: versionId } = useParams();
  const [, setQueryParams] = useQueryParams();
  const versionAnalytics = useVersionAnalytics(versionId);
  const queryVariables = useVersionTasksQueryVariables(versionId);
  const { limit, page, sorts } = queryVariables.taskFilterOptions;

  useEffect(() => {
    setQueryParams({
      [PatchTasksQueryParams.Duration]: undefined,
      [PatchTasksQueryParams.Sorts]: defaultSortMethod,
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const clearQueryParams = () => {
    setQueryParams({
      [PatchTasksQueryParams.TaskName]: undefined,
      [PatchTasksQueryParams.Variant]: undefined,
      [PatchTasksQueryParams.Statuses]: undefined,
      [PatchTasksQueryParams.BaseStatuses]: undefined,
      [PaginationQueryParams.Page]: undefined,
      [PatchTasksQueryParams.Duration]: undefined,
      [PatchTasksQueryParams.Sorts]: defaultSortMethod,
    });
    versionAnalytics.sendEvent({
      name: "Clear all filter",
    });
  };

  const { data, loading, refetch, startPolling, stopPolling } = useQuery<
    VersionTasksQuery,
    VersionTasksQueryVariables
  >(VERSION_TASKS, {
    variables: queryVariables,
    pollInterval: DEFAULT_POLL_INTERVAL,
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
          totalCount={taskCount}
          limit={limit}
          page={page}
          label="tasks"
          onClear={clearQueryParams}
          onPageSizeChange={() => {
            versionAnalytics.sendEvent({
              name: "Change Page Size",
            });
          }}
        />
      }
      shouldShowBottomTableControl={tasksData.length > 10}
    >
      <PatchTasksTable
        isPatch={isPatch}
        sorts={sorts}
        tasks={tasksData}
        loading={tasksData.length === 0 && loading}
      />
    </TableWrapper>
  );
};
