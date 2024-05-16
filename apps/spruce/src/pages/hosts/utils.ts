import { ColumnFiltersState, SortingState } from "@tanstack/react-table";
import { useLocation } from "react-router-dom";
import {
  HostSortBy,
  HostsQueryVariables,
  SortDirection,
} from "gql/generated/types";
import usePagination from "hooks/usePagination";
import { mapQueryParamToId } from "types/host";
import { toArray } from "utils/array";
import { getString, parseQueryString } from "utils/queryString";

type QueryParam = keyof HostsQueryVariables;

const getSortBy = (sortByParam: string | string[] = ""): HostSortBy => {
  const sortBy = getString(sortByParam) as HostSortBy;

  return Object.values(HostSortBy).includes(sortBy)
    ? sortBy
    : HostSortBy.Status; // default sortBy value
};

const getSortDir = (sortDirParam: string | string[]): SortDirection => {
  const sortDir = getString(sortDirParam) as SortDirection;

  return Object.values(SortDirection).includes(sortDir)
    ? sortDir
    : SortDirection.Asc; // default sortDir value
};

const useQueryVariables = (): HostsQueryVariables => {
  const { limit, page } = usePagination();
  const { search } = useLocation();
  const {
    currentTaskId,
    distroId,
    hostId,
    sortBy,
    sortDir,
    startedBy,
    statuses,
  } = parseQueryString(search) as { [key in QueryParam]: string | string[] };

  return {
    hostId: getString(hostId),
    distroId: getString(distroId),
    currentTaskId: getString(currentTaskId),
    statuses: toArray(statuses),
    startedBy: getString(startedBy),
    sortBy: getSortBy(sortBy),
    sortDir: getSortDir(sortDir),
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
  // @ts-ignore: FIXME. This comment was added by an automated script.
  Object.entries(mapQueryParamToId).reduce((accum, [param, id]) => {
    // @ts-ignore: FIXME. This comment was added by an automated script.
    if (queryParams[param]?.length) {
      // @ts-ignore: FIXME. This comment was added by an automated script.
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
  // @ts-ignore: FIXME. This comment was added by an automated script.
  { id: sortBy, desc: sortDir === SortDirection.Desc },
];

export { getFilters, useQueryVariables, getSorting };
