import { useEffect, useState } from "react";
import { useQuery } from "@apollo/client/react";
import { useQueryParam } from "@evg-ui/lib/hooks";
import { DEFAULT_POLL_INTERVAL } from "constants/index";
import {
  WaterfallOptions,
  WaterfallQuery,
  WaterfallQueryVariables,
} from "gql/generated/types";
import { WATERFALL } from "gql/queries";
import { VERSION_LIMIT } from "./constants";
import { ServerFilters, WaterfallFilterOptions } from "./types";
import { useFilters } from "./useFilters";

const unfiltered: ServerFilters = {
  requesters: [],
  statuses: [],
  tasks: [],
  variants: [],
};

type UseWaterfallDataProps = {
  options: Pick<
    WaterfallOptions,
    | "projectIdentifier"
    | "maxOrder"
    | "minOrder"
    | "revision"
    | "date"
    | "omitInactiveBuilds"
  >;
  pins: string[];
};

export const useWaterfallData = ({ options, pins }: UseWaterfallDataProps) => {
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
  const filters = { requesters, statuses, tasks, variants };
  const hasFilters = Object.values(filters).some((filter) => filter.length);
  const omitInactiveBuilds = hasFilters && !!options.omitInactiveBuilds;
  const filterKey = JSON.stringify({
    projectIdentifier: options.projectIdentifier,
    ...filters,
    omitInactiveBuilds,
  });
  const [selection, setSelection] = useState({
    filterKey,
    serverFiltered: false,
    previewKey: "",
  });
  if (selection.filterKey !== filterKey) {
    setSelection({ filterKey, serverFiltered: false, previewKey: "" });
  }
  const serverFiltered =
    selection.filterKey === filterKey && selection.serverFiltered;
  const pageKey = JSON.stringify({
    filterKey,
    maxOrder: options.maxOrder,
    minOrder: options.minOrder,
    date: options.date,
    revision: options.revision,
  });

  const {
    data: queryData,
    dataState,
    error,
    previousData,
  } = useQuery<WaterfallQuery, WaterfallQueryVariables>(WATERFALL, {
    variables: {
      options: {
        ...options,
        limit: VERSION_LIMIT,
        includeAllBuildsAndTasks: false,
        omitInactiveBuilds: serverFiltered && omitInactiveBuilds,
        ...(serverFiltered ? filters : unfiltered),
      },
    },
    pollInterval: DEFAULT_POLL_INTERVAL,
  });
  const complete = dataState === "complete";
  // Only the unfiltered page that started this request is a valid preview.
  const showingPreview =
    !complete && serverFiltered && selection.previewKey === pageKey;
  let data = complete ? queryData : undefined;
  if (showingPreview) {
    data = previousData;
  }
  const view = useFilters({
    activeVersionIds: data?.waterfall.pagination.activeVersionIds ?? [],
    applyClientFilters: !serverFiltered || showingPreview,
    filters,
    flattenedVersions: data?.waterfall.versions ?? [],
    omitInactiveBuilds,
    pins,
  });
  const hasMore =
    data &&
    (options.minOrder
      ? data.waterfall.pagination.hasPrevPage
      : data.waterfall.pagination.hasNextPage);
  const needsServerFilters =
    complete &&
    !serverFiltered &&
    hasFilters &&
    hasMore &&
    view.activeVersionIds.length < VERSION_LIMIT;

  useEffect(() => {
    if (needsServerFilters) {
      // The first committed unfiltered render supplies the preview.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSelection({ filterKey, serverFiltered: true, previewKey: pageKey });
    } else if (complete && serverFiltered && selection.previewKey) {
      setSelection({ filterKey, serverFiltered: true, previewKey: "" });
    }
  }, [
    complete,
    filterKey,
    needsServerFilters,
    pageKey,
    selection.previewKey,
    serverFiltered,
  ]);

  if (error) {
    throw error;
  }

  return {
    ...view,
    data,
    fetchingMore: showingPreview || needsServerFilters,
    loading: !data,
    settled: complete && !needsServerFilters,
  };
};
