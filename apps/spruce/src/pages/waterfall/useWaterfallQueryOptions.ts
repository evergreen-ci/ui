import { useMemo } from "react";
import { useQueryParams } from "@evg-ui/lib/hooks";
import { utcTimeZone } from "constants/time";
import { WaterfallOptions } from "gql/generated/types";
import { useUserTimeZone } from "hooks";
import { getUTCEndOfDay } from "utils/date";
import { VERSION_LIMIT } from "./constants";
import { WaterfallFilterOptions } from "./types";
import { useWaterfallFilters } from "./useWaterfallFilters";

type UseWaterfallQueryOptionsProps = {
  omitInactiveBuilds: boolean;
  projectIdentifier: string;
};

const PARSE_OPTIONS = { parseBooleans: false, parseNumbers: false };

export const useWaterfallQueryOptions = ({
  omitInactiveBuilds,
  projectIdentifier,
}: UseWaterfallQueryOptionsProps) => {
  const [queryParams] = useQueryParams(PARSE_OPTIONS);
  const { requesters, statuses, taskTags, tasks, variantTags, variants } =
    useWaterfallFilters();
  const { date, maxOrder, minOrder, revision } = useMemo(() => {
    const {
      [WaterfallFilterOptions.MaxOrder]: rawMaxOrder,
      [WaterfallFilterOptions.MinOrder]: rawMinOrder,
      [WaterfallFilterOptions.Revision]: rawRevision,
      [WaterfallFilterOptions.Date]: rawDate,
    } = queryParams;
    return {
      maxOrder: typeof rawMaxOrder === "string" ? Number(rawMaxOrder) || 0 : 0,
      minOrder: typeof rawMinOrder === "string" ? Number(rawMinOrder) || 0 : 0,
      revision: typeof rawRevision === "string" ? rawRevision : null,
      date: typeof rawDate === "string" ? rawDate : "",
    };
  }, [queryParams]);
  const timezone = useUserTimeZone() ?? utcTimeZone;
  const utcDate = useMemo(
    () => getUTCEndOfDay(date, timezone),
    [date, timezone],
  );

  const hasFilters = !!(
    requesters.length ||
    statuses.length ||
    tasks.length ||
    taskTags.length ||
    variants.length ||
    variantTags.length
  );
  const queryOptions = useMemo<WaterfallOptions>(
    () => ({
      projectIdentifier,
      requesters,
      statuses,
      tasks,
      taskTags,
      variants,
      variantTags,
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
      taskTags,
      variants,
      variantTags,
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
