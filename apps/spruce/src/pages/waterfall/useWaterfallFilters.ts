import { useMemo } from "react";
import { useQueryParams } from "@evg-ui/lib/hooks";
import { conditionalToArray } from "@evg-ui/lib/utils/array";
import { ServerFilters, WaterfallFilterOptions } from "./types";

const PARSE_OPTIONS = { parseBooleans: false, parseNumbers: false };

const toStringArray = (value: unknown): string[] => {
  if (typeof value === "string" || Array.isArray(value)) {
    return conditionalToArray(value, true).filter(
      (item): item is string => typeof item === "string",
    );
  }
  return [];
};

export const useWaterfallFilters = () => {
  const [queryParams] = useQueryParams(PARSE_OPTIONS);
  return useMemo(
    () =>
      ({
        requesters: toStringArray(
          queryParams[WaterfallFilterOptions.Requesters],
        ),
        statuses: toStringArray(queryParams[WaterfallFilterOptions.Statuses]),
        tasks: toStringArray(queryParams[WaterfallFilterOptions.Task]),
        taskTags: toStringArray(queryParams[WaterfallFilterOptions.TaskTags]),
        variants: toStringArray(
          queryParams[WaterfallFilterOptions.BuildVariant],
        ),
        variantTags: toStringArray(
          queryParams[WaterfallFilterOptions.VariantTags],
        ),
      }) satisfies Required<ServerFilters>,
    [queryParams],
  );
};
