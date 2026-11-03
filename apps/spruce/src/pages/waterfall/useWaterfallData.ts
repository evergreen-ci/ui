import { useMemo } from "react";
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
import { VERSION_LIMIT } from "./constants";
import { WaterfallFilterOptions } from "./types";
import { useFilters } from "./useFilters";
import { normalizeWaterfallFilters } from "./utils";

type UseWaterfallDataProps = {
  omitInactiveBuilds: boolean;
  pins: string[];
  projectIdentifier: string;
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
  const queryOptions = useMemo<WaterfallOptions>(
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

  const queryResult = useFilters({
    activeVersionIds: queryData?.waterfall.pagination.activeVersionIds ?? [],
    flattenedVersions: queryData?.waterfall.versions ?? [],
    filters: queryOptions,
    omitInactiveBuilds: !!queryOptions.omitInactiveBuilds,
    pins,
    serverFiltered: hasFilters,
  });

  const previewOptions = useMemo<WaterfallOptions>(
    () => ({
      ...queryOptions,
      ...normalizeWaterfallFilters({ projectIdentifier }),
    }),
    [queryOptions, projectIdentifier],
  );
  const { data: previewData } = useQuery<
    WaterfallQuery,
    WaterfallQueryVariables
  >(WATERFALL, {
    variables: { options: previewOptions },
    fetchPolicy: "cache-only",
    skip: !hasFilters,
  });
  const previewResult = useFilters({
    activeVersionIds: previewData?.waterfall.pagination.activeVersionIds ?? [],
    flattenedVersions: previewData?.waterfall.versions ?? [],
    filters: queryOptions,
    omitInactiveBuilds: !!queryOptions.omitInactiveBuilds,
    pins,
    serverFiltered: false,
  });

  const isFetching = dataState !== "complete" && !error;
  const showPreview = isFetching && hasFilters && !!previewData;

  return {
    ...(showPreview ? previewResult : queryResult),
    data: showPreview ? previewData : queryData,
    displayedOptions: showPreview ? previewOptions : queryOptions,
    error,
    isFetching,
  };
};
