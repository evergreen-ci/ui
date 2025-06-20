import { ColumnFiltersState, SortingState } from "@tanstack/react-table";
import {
  HostSortBy,
  HostsQueryVariables,
  SortDirection,
} from "gql/generated/types";
import usePagination from "hooks/usePagination";
import { useQueryParam } from "hooks/useQueryParam";
import { mapQueryParamToId } from "types/host";
import { parseSortString } from "utils/queryString";
import { HostsQueryParams } from "./constants";

const useQueryVariables = (): HostsQueryVariables => {
  const { limit, page } = usePagination();
  const [currentTaskId] = useQueryParam(HostsQueryParams.CurrentTaskId, "");
  const [distroId] = useQueryParam(HostsQueryParams.DistroId, "");
  const [hostId] = useQueryParam(HostsQueryParams.HostId, "");
  const [sorts] = useQueryParam(HostsQueryParams.Sorts, "");
  const [startedBy] = useQueryParam(HostsQueryParams.StartedBy, "");
  const [statuses] = useQueryParam(HostsQueryParams.Statuses, []);

  // Parse the sorts query param into an array of sort objects
  const sortsArray = parseSortString(sorts ?? "", {
    sortByKey: "sortBy",
    sortDirKey: "sortDir",
    sortCategoryEnum: HostSortBy,
  });

  // Default to status sort if no sorts are provided. We only support one sort at a time.
  const sortBy = sortsArray[0]?.sortBy ?? HostSortBy.Status;
  const sortDir = sortsArray[0]?.sortDir ?? SortDirection.Asc;

  return {
    hostId,
    distroId,
    currentTaskId,
    statuses,
    startedBy,
    sortBy,
    sortDir,
    page,
    limit,
  };
};

/**
 * `getFilters` converts query param values into react-table's column filters state.
 * @param queryParams - query params from the URL
 * @returns - react-table's filtering state
 */
const getFilters = (queryParams: HostsQueryVariables): ColumnFiltersState =>
  // @ts-expect-error: FIXME. This comment was added by an automated script.
  Object.entries(mapQueryParamToId).reduce((accum, [param, id]) => {
    // @ts-expect-error: FIXME. This comment was added by an automated script.
    if (queryParams[param]?.length) {
      // @ts-expect-error: FIXME. This comment was added by an automated script.
      return [...accum, { id, value: queryParams[param] }];
    }
    return accum;
  }, []);

/**
 * `getSorting` converts query param values into react-table's sorting state.
 * @param queryParams - query params from the URL
 * @param queryParams.sorts - unified sorts parameter
 * @returns - react-table's sorting state
 */
const getSorting = (queryParams: HostsQueryVariables): SortingState => {
  const { sortBy, sortDir } = queryParams;
  return [
    // @ts-expect-error: FIXME. This comment was added by an automated script.
    { id: sortBy, desc: sortDir === SortDirection.Desc },
  ];
};

export { getFilters, useQueryVariables, getSorting };
