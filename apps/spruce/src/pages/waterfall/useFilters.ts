import { useMemo } from "react";
import { Unpacked } from "@evg-ui/lib/types/utils";
import { VERSION_LIMIT } from "./constants";
import {
  Build,
  BuildVariant,
  Pagination,
  ServerFilters,
  Version,
} from "./types";
import { groupBuildVariants, groupInactiveVersions } from "./utils";

const EMPTY_FILTER: string[] = [];

type UseFiltersProps = {
  activeVersionIds: Pagination["activeVersionIds"];
  applyClientFilters?: boolean;
  filters: ServerFilters;
  flattenedVersions: Version[];
  omitInactiveBuilds: boolean;
  pins: string[];
};

export const useFilters = ({
  activeVersionIds,
  applyClientFilters = true,
  filters,
  flattenedVersions,
  omitInactiveBuilds,
  pins,
}: UseFiltersProps) => {
  const buildVariants = useMemo(
    () => groupBuildVariants(flattenedVersions),
    [flattenedVersions],
  );

  const requesters = filters.requesters ?? EMPTY_FILTER;
  const statuses = filters.statuses ?? EMPTY_FILTER;
  const buildVariantFilter = filters.variants ?? EMPTY_FILTER;
  const taskFilter = filters.tasks ?? EMPTY_FILTER;

  const buildVariantFilterRegex: RegExp[] = useMemo(
    () => (applyClientFilters ? makeFilterRegex(buildVariantFilter) : []),
    [applyClientFilters, buildVariantFilter],
  );

  const taskFilterRegex: RegExp[] = useMemo(
    () => (applyClientFilters ? makeFilterRegex(taskFilter) : []),
    [applyClientFilters, taskFilter],
  );

  const filteredBuildVariants = useMemo(() => {
    const bvs: BuildVariant[] = [];

    const activeVersions = flattenedVersions.filter(
      (v) =>
        activeVersionIds.includes(v.id) &&
        (!applyClientFilters || matchesRequesters(v, requesters)),
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
          if (applyClientFilters && omitInactiveBuilds && !b.activated) {
            return;
          }
          if (
            applyClientFilters &&
            (taskFilterRegex.length || statuses.length)
          ) {
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
        bvs.push({ ...bv, builds: activeBuilds });
      }
    });
    return bvs;
  }, [
    activeVersionIds,
    applyClientFilters,
    buildVariantFilterRegex,
    buildVariants,
    flattenedVersions,
    omitInactiveBuilds,
    requesters,
    statuses,
    taskFilterRegex,
  ]);

  const orderedBuildVariants = useMemo(() => {
    if (!pins.length) {
      return filteredBuildVariants;
    }
    const pinned: BuildVariant[] = [];
    const unpinned: BuildVariant[] = [];
    filteredBuildVariants.forEach((bv) => {
      (pins.includes(bv.id) ? pinned : unpinned).push(bv);
    });
    return [...pinned, ...unpinned];
  }, [filteredBuildVariants, pins]);

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
    buildVariants: orderedBuildVariants,
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
  statuses.length ? statuses.some((s) => task.displayStatusCache === s) : true;

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
