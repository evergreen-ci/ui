import { useMemo } from "react";
import { WaterfallVersionFragment } from "gql/generated/types";
import { useQueryParam } from "hooks/useQueryParam";
import { Build, BuildVariant, WaterfallFilterOptions } from "./types";
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

  const [buildVariantFilter] = useQueryParam<string[]>(
    WaterfallFilterOptions.BuildVariant,
    [],
  );

  const [taskFilter] = useQueryParam<string[]>(WaterfallFilterOptions.Task, []);

  const hasFilters = useMemo(
    () => requesters.length || buildVariantFilter.length || taskFilter.length,
    [buildVariantFilter, requesters, taskFilter],
  );

  const buildVariantFilterRegex: RegExp[] = useMemo(
    () => makeFilterRegex(buildVariantFilter),
    [buildVariantFilter],
  );

  const taskFilterRegex: RegExp[] = useMemo(
    () => makeFilterRegex(taskFilter),
    [taskFilter],
  );

  const filteredBuildVariants = useMemo(() => {
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

    const activeVersions = flattenedVersions.filter(
      (v) => v.activated && matchesRequesters(v, requesters),
    );

    buildVariants.forEach((bv) => {
      const passesBVFilter =
        !buildVariantFilterRegex.length ||
        buildVariantFilterRegex.some((r) => bv.displayName.match(r));

      if (!passesBVFilter) {
        return;
      }

      if (requesters.length || taskFilterRegex.length) {
        const activeBuilds: Build[] = [];
        bv.builds.forEach((b) => {
          if (activeVersions.find(({ id }) => id === b.version)) {
            if (taskFilterRegex.length) {
              const activeTasks = b.tasks.filter((t) =>
                taskFilterRegex.some((r) => t.displayName.match(r)),
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
      } else {
        pushVariant(bv);
      }
    });
    return bvs;
  }, [
    buildVariantFilterRegex,
    buildVariants,
    flattenedVersions,
    hasFilters,
    pins,
    requesters,
    taskFilterRegex,
  ]);

  const activeVersions = useMemo(() => {
    const hasActiveBuild = (versionId: string) =>
      filteredBuildVariants.some((bv) =>
        bv.builds.some((build) => build.version === versionId),
      );

    return groupInactiveVersions(flattenedVersions, hasActiveBuild);
  }, [filteredBuildVariants, flattenedVersions]);

  const activeVersionIds = useMemo(
    () =>
      activeVersions.reduce((ids: string[], { version }) => {
        if (version) {
          ids.push(version.id);
        }
        return ids;
      }, []),
    [activeVersions],
  );

  return {
    activeVersionIds,
    buildVariants: filteredBuildVariants,
    versions: activeVersions,
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
