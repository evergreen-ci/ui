import { useMemo } from "react";
import { useQueryParams } from "@evg-ui/lib/hooks";
import { utcTimeZone } from "constants/time";
import { WaterfallOptions } from "gql/generated/types";
import { useUserTimeZone } from "hooks";
import { getUTCEndOfDay } from "utils/date";
import { VERSION_LIMIT } from "./constants";
import { WaterfallFilterOptions } from "./types";
import { normalizeWaterfallFilters } from "./utils";

type UseWaterfallQueryParamsProps = {
  omitInactiveBuilds: boolean;
  projectIdentifier: string;
};

const PARSE_OPTIONS = { parseBooleans: false, parseNumbers: false };

const toStringArray = (value: unknown): string[] | undefined => {
  if (Array.isArray(value)) {
    return value.filter((item): item is string => typeof item === "string");
  }
  return typeof value === "string" ? [value] : undefined;
};

export const useWaterfallQueryParams = ({
  omitInactiveBuilds,
  projectIdentifier,
}: UseWaterfallQueryParamsProps) => {
  const [queryParams] = useQueryParams(PARSE_OPTIONS);
  const {
    date,
    maxOrder,
    minOrder,
    requesters,
    revision,
    statuses,
    tasks,
    variants,
  } = useMemo(() => {
    const {
      [WaterfallFilterOptions.MaxOrder]: rawMaxOrder,
      [WaterfallFilterOptions.MinOrder]: rawMinOrder,
      [WaterfallFilterOptions.Revision]: rawRevision,
      [WaterfallFilterOptions.Date]: rawDate,
    } = queryParams;
    return {
      ...normalizeWaterfallFilters({
        projectIdentifier,
        requesters: toStringArray(
          queryParams[WaterfallFilterOptions.Requesters],
        ),
        statuses: toStringArray(queryParams[WaterfallFilterOptions.Statuses]),
        tasks: toStringArray(queryParams[WaterfallFilterOptions.Task]),
        variants: toStringArray(
          queryParams[WaterfallFilterOptions.BuildVariant],
        ),
      }),
      maxOrder: typeof rawMaxOrder === "string" ? Number(rawMaxOrder) || 0 : 0,
      minOrder: typeof rawMinOrder === "string" ? Number(rawMinOrder) || 0 : 0,
      revision: typeof rawRevision === "string" ? rawRevision : null,
      date: typeof rawDate === "string" ? rawDate : "",
    };
  }, [queryParams, projectIdentifier]);
  const timezone = useUserTimeZone() ?? utcTimeZone;
  const utcDate = useMemo(
    () => getUTCEndOfDay(date, timezone),
    [date, timezone],
  );

  const hasFilters = !!(
    requesters.length ||
    statuses.length ||
    tasks.length ||
    variants.length
  );
  const queryOptions = useMemo<WaterfallOptions>(
    () => ({
      projectIdentifier,
      requesters,
      statuses,
      tasks,
      variants,
      includeAllBuildsAndTasks: !hasFilters,
      omitInactiveBuilds: omitInactiveBuilds && variants.length > 0,
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

  return { hasFilters, queryOptions };
};
