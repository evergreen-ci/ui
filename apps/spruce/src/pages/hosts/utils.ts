import { ColumnFiltersState, SortingState } from "@tanstack/react-table";
import {
  HostSortBy,
  HostsQueryVariables,
  SortDirection,
} from "gql/generated/types";
import { mapQueryParamToId } from "types/host";
import { toArray } from "utils/array";
import { getString, parseQueryString } from "utils/queryString";
import { getLimitFromSearch, getPageFromSearch } from "utils/url";

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

const getQueryVariables = (search: string): HostsQueryVariables => {
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
    page: getPageFromSearch(search),
    limit: getLimitFromSearch(search),
  };
};

/**
 * `getFilters` converts query param values into react-table's column filters state.
 * @param queryParams - query params from the URL
 * @returns - react-table's filtering state
 */
const getFilters = (queryParams: HostsQueryVariables): ColumnFiltersState =>
  Object.entries(mapQueryParamToId).reduce((accum, [param, id]) => {
    if (queryParams[param]?.length) {
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
  { id: sortBy, desc: sortDir === SortDirection.Desc },
];

export { getFilters, getQueryVariables, getSorting };
