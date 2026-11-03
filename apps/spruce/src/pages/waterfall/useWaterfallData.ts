import { useMemo } from "react";
import { useQuery } from "@apollo/client/react";
import { useErrorToast } from "@evg-ui/lib/hooks";
import { DEFAULT_POLL_INTERVAL } from "constants/index";
import {
  WaterfallOptions,
  WaterfallQuery,
  WaterfallQueryVariables,
} from "gql/generated/types";
import { WATERFALL } from "gql/queries";
import { useFilters } from "./useFilters";
import { useWaterfallQueryParams } from "./useWaterfallQueryParams";
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
  const { hasFilters, queryOptions } = useWaterfallQueryParams({
    omitInactiveBuilds,
    projectIdentifier,
  });

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
