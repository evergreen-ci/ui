import { useMemo } from "react";
import { useQueryParam } from "@evg-ui/lib/hooks";
import { Unpacked } from "@evg-ui/lib/types";
import { VERSION_LIMIT } from "./constants";
import {
  Build,
  BuildVariant,
  Pagination,
  Version,
  WaterfallFilterOptions,
} from "./types";
import { groupBuildVariants, groupInactiveVersions } from "./utils";

type UseFiltersProps = {
  activeVersionIds: Pagination["activeVersionIds"];
  flattenedVersions: Version[];
  pins: string[];
};

export const useFilters = ({
  activeVersionIds,
  flattenedVersions,
  pins,
}: UseFiltersProps) => {
  const buildVariants = groupBuildVariants(flattenedVersions);

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

  const buildVariantFilterRegex: RegExp[] = useMemo(
    () => makeFilterRegex(buildVariantFilter),
    [buildVariantFilter],
  );

  const taskFilterRegex: RegExp[] = useMemo(
    () => makeFilterRegex(taskFilter),
    [taskFilter],
  );

  const filteredBuildVariants = useMemo(() => {
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

    const activeVersions = flattenedVersions.filter(
      (v) =>
        activeVersionIds.includes(v.id) && matchesRequesters(v, requesters),
    );

    buildVariants.forEach((bv) => {
      const passesBVFilter =
        !buildVariantFilterRegex.length ||
        buildVariantFilterRegex.some(
          (r) => bv.displayName.match(r) || bv.id.match(r),
        );

      if (!passesBVFilter) {
        return;
      }

      const activeBuilds: Build[] = [];
      bv.builds.forEach((b) => {
        if (activeVersions.find(({ id }) => id === b.version)) {
          if (taskFilterRegex.length || statuses.length) {
            const activeTasks = b.tasks.filter(
              (t) =>
                matchesTasksFilter(t, taskFilterRegex) &&
                matchesStatuses(t, statuses),
            );
            if (activeTasks.length) {
              activeBuilds.push({ ...b, tasks: activeTasks });
            }
          } else {
            activeBuilds.push(b);
          }
        }
      });
      if (activeBuilds.length) {
        pushVariant({ ...bv, builds: activeBuilds });
      }
    });
    return bvs;
  }, [
    activeVersionIds,
    buildVariantFilterRegex,
    buildVariants,
    flattenedVersions,
    pins,
    requesters,
    statuses,
    taskFilterRegex,
  ]);

  const groupedVersions = useMemo(() => {
    const hasActiveBuild = (version: Version) =>
      filteredBuildVariants.some((bv) =>
        bv.builds.some((build) => build.version === version.id),
      );

    return groupInactiveVersions(
      flattenedVersions,
      hasActiveBuild,
      VERSION_LIMIT,
    );
  }, [filteredBuildVariants, flattenedVersions]);

  const filteredVersionIds = useMemo(
    () =>
      groupedVersions.reduce((ids: string[], { version }) => {
        if (version) {
          ids.push(version.id);
        }
        return ids;
      }, []),
    [groupedVersions],
  );

  return {
    activeVersionIds: filteredVersionIds,
    buildVariants: filteredBuildVariants,
    versions: groupedVersions,
  };
};

/**
 * matchesRequesters evaluates whether a version should be shown to the user given a set of requester filters
 * @param version - the version being validated against
 * @param requesters - list of applied requester filters
 * @returns - true if no filters are applied, or if the version matches applied filters
 */
const matchesRequesters = (version: Version, requesters: string[]) => {
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
        task.displayStatusCache
          ? task.displayStatusCache === s
          : task.status === s,
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
