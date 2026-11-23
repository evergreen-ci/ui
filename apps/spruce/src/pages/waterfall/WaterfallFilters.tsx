import { useCallback } from "react";
import { useApolloClient } from "@apollo/client/react";
import { useQueryParam, useQueryParams } from "@evg-ui/lib/hooks";
import { useWaterfallAnalytics } from "analytics";
import { DateFilter } from "components/DateFilter";
import { ProjectSelect } from "components/ProjectSelect";
import { getWaterfallRoute } from "constants/routes";
import { BuildVariantFilter } from "./BuildVariantFilter";
import { evictWaterfallCache } from "./caching/utils";
import { walkthroughSteps, waterfallGuideId } from "./constants";
import { PaginationButtons } from "./PaginationButtons";
import { RequesterFilter } from "./RequesterFilter";
import { StatusFilter } from "./StatusFilter";
import { TaskFilter } from "./TaskFilter";
import { TextFilterChips } from "./TextFilterChips";
import { Pagination, WaterfallFilterOptions } from "./types";
import styles from "./WaterfallFilters.module.css";
import { WaterfallMenu } from "./WaterfallMenu";

type WaterfallFiltersProps = {
  omitInactiveBuilds: boolean;
  projectIdentifier: string;
  pagination: Pagination | undefined;
  restartWalkthrough: () => void;
  setOmitInactiveBuilds: (value: boolean) => void;
};

export const WaterfallFilters: React.FC<WaterfallFiltersProps> = ({
  omitInactiveBuilds,
  pagination,
  projectIdentifier,
  restartWalkthrough,
  setOmitInactiveBuilds,
}) => {
  const { sendEvent } = useWaterfallAnalytics();
  const { cache } = useApolloClient();

  const [queryParams, setQueryParams] = useQueryParams();
  const [statuses] = useQueryParam<string[]>(
    WaterfallFilterOptions.Statuses,
    [],
  );
  const [date] = useQueryParam<string>(WaterfallFilterOptions.Date, "");

  const projectSelectRoute = useCallback(
    (identifier: string) =>
      getWaterfallRoute(identifier, { statusFilters: statuses }),
    [statuses],
  );

  return (
    <>
      <div className={styles.container}>
        <div className={styles.buildVariantTaskFilterItem}>
          <BuildVariantFilter />
        </div>
        <div className={styles.buildVariantTaskFilterItem}>
          <TaskFilter />
        </div>
        <div className={styles.statusFilterItem}>
          <StatusFilter />
        </div>
        <div className={styles.requesterFilterItem}>
          <RequesterFilter />
        </div>
        <div className={styles.dateFilterItem}>
          <DateFilter
            dataProps={{ [waterfallGuideId]: walkthroughSteps[3].targetId }}
            onChange={(newDate) => {
              setQueryParams({
                ...queryParams,
                [WaterfallFilterOptions.MaxOrder]: undefined,
                [WaterfallFilterOptions.MinOrder]: undefined,
                [WaterfallFilterOptions.Date]: newDate,
              });
              sendEvent({ name: "Filtered by date" });
            }}
            showLabel
            value={date}
          />
        </div>
        <div className={styles.projectFilterItem}>
          <ProjectSelect
            getProjectRoute={projectSelectRoute}
            onSubmit={(project: string) => {
              evictWaterfallCache(cache, { broadcast: false });

              sendEvent({
                name: "Changed project",
                project,
              });
            }}
            selectedProjectIdentifier={projectIdentifier}
          />
        </div>
        <WaterfallMenu
          omitInactiveBuilds={omitInactiveBuilds}
          projectIdentifier={projectIdentifier}
          restartWalkthrough={restartWalkthrough}
          setOmitInactiveBuilds={setOmitInactiveBuilds}
        />
        <PaginationButtons pagination={pagination} />
      </div>

      <TextFilterChips />
    </>
  );
};
