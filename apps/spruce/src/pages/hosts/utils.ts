import { ColumnFiltersState, SortingState } from "@tanstack/react-table";
import {
  HostSortBy,
  HostsQueryVariables,
  SortDirection,
} from "gql/generated/types";
import usePagination from "hooks/usePagination";
import { useQueryParam } from "hooks/useQueryParam";
import { mapQueryParamToId } from "types/host";
import { HostsQueryParams } from "./constants";

const useQueryVariables = (): HostsQueryVariables => {
  const { limit, page } = usePagination();
  const [currentTaskId] = useQueryParam(HostsQueryParams.CurrentTaskId, "");
  const [distroId] = useQueryParam(HostsQueryParams.DistroId, "");
  const [hostId] = useQueryParam(HostsQueryParams.HostId, "");
  const [sortBy] = useQueryParam(HostsQueryParams.SortBy, HostSortBy.Status);
  const [sortDir] = useQueryParam(HostsQueryParams.SortDir, SortDirection.Asc);
  const [startedBy] = useQueryParam(HostsQueryParams.StartedBy, "");
  const [statuses] = useQueryParam(HostsQueryParams.Statuses, []);

  return {
    hostId,
    distroId,
    currentTaskId,
    statuses,
    startedBy,
    sortBy: Object.values(HostSortBy).includes(sortBy)
      ? sortBy
      : HostSortBy.Status,
    sortDir: Object.values(SortDirection).includes(sortDir)
      ? sortDir
      : SortDirection.Asc,
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
 * @param queryParams.sortBy - key indicating the field that is being sorted
 * @param queryParams.sortDir - direction of the sort
 * @returns - react-table's sorting state
 */
const getSorting = ({ sortBy, sortDir }: HostsQueryVariables): SortingState => [
  // @ts-expect-error: FIXME. This comment was added by an automated script.
  { id: sortBy, desc: sortDir === SortDirection.Desc },
];

export { getFilters, useQueryVariables, getSorting };
