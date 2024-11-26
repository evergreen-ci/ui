import { useMemo } from "react";
import { Unpacked } from "@evg-ui/lib/types/utils";
import { WaterfallVersionFragment } from "gql/generated/types";
import { useQueryParam } from "hooks/useQueryParam";
import {
  Build,
  BuildVariant,
  WaterfallFilterOptions,
  WaterfallVersion,
} from "./types";
import { groupInactiveVersions } from "./utils";

type UseFiltersProps = {
  buildVariants: BuildVariant[];
  flattenedVersions: WaterfallVersionFragment[];
  pins: string[];
};

export const useFilters = ({
  buildVariants,
  flattenedVersions,
  pins,
}: UseFiltersProps) => {
  const [requesters] = useQueryParam<string[]>(
    WaterfallFilterOptions.Requesters,
    [],
  );

  const [statuses] = useQueryParam<string[]>(
    WaterfallFilterOptions.Statuses,
    [],
  );

  const [buildVariantFilter] = useQueryParam<string[]>(
    WaterfallFilterOptions.BuildVariant,
    [],
  );

  const [taskFilter] = useQueryParam<string[]>(WaterfallFilterOptions.Task, []);

  const hasFilters = useMemo(
    () =>
      requesters.length ||
      statuses.length ||
      buildVariantFilter.length ||
      taskFilter.length,
    [buildVariantFilter, requesters, statuses, taskFilter],
  );

  const versions = useMemo(
    () => groupInactiveVersions(flattenedVersions),
    [flattenedVersions],
  );

  const versionsResult = useMemo(() => {
    if (!hasFilters) {
      return versions;
    }

    const filteredVersions: WaterfallVersion[] = [];

    const pushInactive = (v: WaterfallVersionFragment) => {
      if (!filteredVersions?.[filteredVersions.length - 1]?.inactiveVersions) {
        filteredVersions.push({ version: null, inactiveVersions: [] });
      }
      filteredVersions[filteredVersions.length - 1].inactiveVersions?.push(v);
    };

    const pushActive = (v: WaterfallVersionFragment) => {
      filteredVersions.push({
        inactiveVersions: null,
        version: v,
      });
    };

    versions.forEach(({ inactiveVersions, version }) => {
      if (version) {
        if (matchesRequesters(version, requesters)) {
          pushActive(version);
        } else {
          pushInactive(version);
        }
      } else if (inactiveVersions) {
        inactiveVersions.forEach(pushInactive);
      }
    });

    return filteredVersions;
  }, [hasFilters, requesters, versions]);

  const activeVersionIds = useMemo(
    () =>
      versionsResult.reduce((ids: string[], { version }) => {
        if (version) {
          ids.push(version.id);
        }
        return ids;
      }, []),
    [versionsResult],
  );

  const buildVariantFilterRegex: RegExp[] = useMemo(
    () => makeFilterRegex(buildVariantFilter),
    [buildVariantFilter],
  );

  const taskFilterRegex: RegExp[] = useMemo(
    () => makeFilterRegex(taskFilter),
    [taskFilter],
  );

  const buildVariantsResult = useMemo(() => {
    if (!hasFilters && !pins.length) {
      return buildVariants;
    }

    const bvs: BuildVariant[] = [];

    let pinIndex = 0;
    const pushVariant = (variant: BuildVariant) => {
      if (pins.includes(variant.id)) {
        // If build variant is pinned, insert it at the end of the list of pinned variants
        bvs.splice(pinIndex, 0, variant);
        pinIndex += 1;
      } else {
        bvs.push(variant);
      }
    };

    buildVariants.forEach((bv) => {
      const passesBVFilter =
        !buildVariantFilterRegex.length ||
        buildVariantFilterRegex.some((r) => bv.displayName.match(r));
      if (passesBVFilter) {
        if (
          activeVersionIds.length !== bv.builds.length ||
          taskFilterRegex.length ||
          statuses.length
        ) {
          const activeBuilds: Build[] = [];
          bv.builds.forEach((b) => {
            if (activeVersionIds.includes(b.version)) {
              if (taskFilterRegex.length || statuses.length) {
                const activeTasks = b.tasks.filter(
                  (t) =>
                    matchesTasksFilter(t, taskFilterRegex) &&
                    matchesStatuses(t, statuses),
                );
                activeBuilds.push({
                  ...b,
                  tasks: activeTasks,
                });
              } else {
                activeBuilds.push(b);
              }
            }
          });
          if (
            activeBuilds.length &&
            activeBuilds.some((b) => b.tasks.length > 0)
          ) {
            pushVariant({ ...bv, builds: activeBuilds });
          }
        } else {
          pushVariant(bv);
        }
      }
    });
    return bvs;
  }, [
    activeVersionIds,
    buildVariantFilterRegex,
    buildVariants,
    hasFilters,
    pins,
    statuses,
    taskFilterRegex,
  ]);

  return {
    activeVersionIds,
    buildVariants: buildVariantsResult,
    versions: versionsResult,
  };
};

/**
 * matchesRequesters evaluates whether a version should be shown to the user given a set of requester filters
 * @param version - the version being validated against
 * @param requesters - list of applied requester filters
 * @returns - true if no filters are applied, or if the version matches applied filters
 */
const matchesRequesters = (
  version: WaterfallVersionFragment,
  requesters: string[],
) => {
  if (!requesters.length) {
    return true;
  }
  return requesters.some((r) => r === version.requester);
};

/**
 * matchesStatuses evaluates whether a task should be shown to the user given a set of status filters
 * @param task - the task being validated against
 * @param statuses - list of applied task status filters
 * @returns - true if no filters are applied, or if the task matches applied filters
 */
const matchesStatuses = (
  task: Unpacked<Unpacked<BuildVariant["builds"]>["tasks"]>,
  statuses: string[],
) =>
  statuses.length
    ? statuses.some((s) =>
        task.displayStatus ? task.displayStatus === s : task.status === s,
      )
    : true;

/**
 * matchesTasksFilter evaluates whether a task should be shown to the user given a set of task name filter regexes
 * @param task - the task being validated against
 * @param taskFilterRegex - list of applied task name filters
 * @returns - true if no filters are applied, or if the task matches applied filters
 */
const matchesTasksFilter = (
  task: Unpacked<Unpacked<BuildVariant["builds"]>["tasks"]>,
  taskFilterRegex: RegExp[],
) =>
  taskFilterRegex.length
    ? taskFilterRegex.some((r) => task.displayName.match(r))
    : true;

const makeFilterRegex = (filters: string[]) =>
  filters.reduce<RegExp[]>((accum, curr) => {
    let regex;
    try {
      regex = new RegExp(curr, "i");
    } catch {
      return accum;
    }
    return [...accum, regex];
  }, []);
