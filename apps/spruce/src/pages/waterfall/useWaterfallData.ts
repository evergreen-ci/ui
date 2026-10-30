import { useMemo, useState } from "react";
import { useQuery } from "@apollo/client/react";
import { useErrorToast, useQueryParam } from "@evg-ui/lib/hooks";
import { DEFAULT_POLL_INTERVAL } from "constants/index";
import { utcTimeZone } from "constants/time";
import {
  WaterfallOptions,
  WaterfallQuery,
  WaterfallQueryVariables,
} from "gql/generated/types";
import { WATERFALL } from "gql/queries";
import { useUserTimeZone } from "hooks";
import { getUTCEndOfDay } from "utils/date";
import { getWaterfallAnchorKey } from "./caching/utils";
import { VERSION_LIMIT } from "./constants";
import { WaterfallFilterOptions } from "./types";
import { useFilters } from "./useFilters";
import { normalizeWaterfallFilters } from "./utils";

type UseWaterfallDataProps = {
  omitInactiveBuilds: boolean;
  pins: string[];
  projectIdentifier: string;
};

type DisplayedWaterfall = {
  data?: WaterfallQuery;
  options: WaterfallOptions;
  applyClientFilters: boolean;
};

export const useWaterfallData = ({
  omitInactiveBuilds,
  pins,
  projectIdentifier,
}: UseWaterfallDataProps) => {
  const [maxOrder] = useQueryParam<number>(WaterfallFilterOptions.MaxOrder, 0);
  const [minOrder] = useQueryParam<number>(WaterfallFilterOptions.MinOrder, 0);
  const [revision] = useQueryParam<string | null>(
    WaterfallFilterOptions.Revision,
    null,
  );
  const [date] = useQueryParam<string>(WaterfallFilterOptions.Date, "");
  const timezone = useUserTimeZone() ?? utcTimeZone;
  const utcDate = useMemo(
    () => getUTCEndOfDay(date, timezone),
    [date, timezone],
  );

  const [requesters] = useQueryParam<string[]>(
    WaterfallFilterOptions.Requesters,
    [],
  );
  const [statuses] = useQueryParam<string[]>(
    WaterfallFilterOptions.Statuses,
    [],
  );
  const [tasks] = useQueryParam<string[]>(WaterfallFilterOptions.Task, []);
  const [variants] = useQueryParam<string[]>(
    WaterfallFilterOptions.BuildVariant,
    [],
  );

  const hasFilters = !!(
    requesters.length ||
    statuses.length ||
    tasks.length ||
    variants.length
  );
  const selectedQueryOptions = useMemo<WaterfallOptions>(
    () => ({
      ...normalizeWaterfallFilters({
        projectIdentifier,
        requesters,
        statuses,
        tasks,
        variants,
        includeAllBuildsAndTasks: !hasFilters,
        omitInactiveBuilds: omitInactiveBuilds && variants.length > 0,
      }),
      limit: VERSION_LIMIT,
      maxOrder,
      minOrder,
      revision,
      date: utcDate,
    }),
    [
      projectIdentifier,
      requesters,
      statuses,
      tasks,
      variants,
      hasFilters,
      omitInactiveBuilds,
      maxOrder,
      minOrder,
      revision,
      utcDate,
    ],
  );

  const [displayedResult, setDisplayedResult] = useState<DisplayedWaterfall>(
    () => ({
      options: {
        ...selectedQueryOptions,
        ...normalizeWaterfallFilters({ projectIdentifier }),
      },
      applyClientFilters: true,
    }),
  );
  const { data } = displayedResult;
  const pageChanged =
    getWaterfallAnchorKey({ options: displayedResult.options }) !==
    getWaterfallAnchorKey({ options: selectedQueryOptions });

  const { activeVersionIds, buildVariants, versions } = useFilters({
    activeVersionIds: data?.waterfall.pagination.activeVersionIds ?? [],
    flattenedVersions: data?.waterfall.versions ?? [],
    filters: displayedResult.applyClientFilters
      ? selectedQueryOptions
      : displayedResult.options,
    omitInactiveBuilds: displayedResult.applyClientFilters
      ? !!selectedQueryOptions.omitInactiveBuilds
      : !!displayedResult.options.omitInactiveBuilds,
    pins,
    serverFiltered: !displayedResult.applyClientFilters,
  });

  const hasMore =
    data &&
    (displayedResult.options.minOrder
      ? data.waterfall.pagination.hasPrevPage
      : data.waterfall.pagination.hasNextPage);
  const shouldFetchMore =
    displayedResult.applyClientFilters &&
    hasFilters &&
    hasMore &&
    activeVersionIds.length < VERSION_LIMIT;
  const applyClientFilters =
    displayedResult.applyClientFilters && !pageChanged && !shouldFetchMore;
  const queryOptions = applyClientFilters
    ? displayedResult.options
    : selectedQueryOptions;
  const queryChanged =
    JSON.stringify(queryOptions) !== JSON.stringify(displayedResult.options);

  const {
    data: queryData,
    dataState,
    error,
  } = useQuery<WaterfallQuery, WaterfallQueryVariables>(WATERFALL, {
    variables: { options: queryOptions },
    pollInterval: DEFAULT_POLL_INTERVAL,
    fetchPolicy: "cache-first",
    refetchWritePolicy: "merge",
  });
  useErrorToast(error, "Unable to load waterfall");

  // Update before rendering children so cache hits never flash a skeleton or stale filters.
  if (
    dataState === "complete" &&
    (queryData !== data ||
      queryChanged ||
      applyClientFilters !== displayedResult.applyClientFilters)
  ) {
    setDisplayedResult({
      data: queryData,
      options: queryOptions,
      applyClientFilters,
    });
  }

  return {
    activeVersionIds,
    buildVariants,
    data: pageChanged ? undefined : data,
    displayedOptions: displayedResult.options,
    error,
    isFetching: shouldFetchMore || queryChanged,
    versions,
  };
};
