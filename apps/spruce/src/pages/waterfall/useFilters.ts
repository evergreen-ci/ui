import { useMemo } from "react";
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

  const [buildVariantFilter] = useQueryParam<string[]>(
    WaterfallFilterOptions.BuildVariant,
    [],
  );

  const [taskFilter] = useQueryParam<string[]>(WaterfallFilterOptions.Task, []);

  const hasFilters = useMemo(
    () => requesters.length || buildVariantFilter.length || taskFilter.length,
    [buildVariantFilter, requesters, taskFilter],
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
      new Set(
        versionsResult.reduce((ids: string[], { version }) => {
          if (version) {
            ids.push(version.id);
          }
          return ids;
        }, []),
      ),
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
          activeVersionIds.size !== bv.builds.length ||
          taskFilterRegex.length
        ) {
          const activeBuilds: Build[] = [];
          bv.builds.forEach((b) => {
            if (activeVersionIds.has(b.version)) {
              if (taskFilterRegex.length) {
                const activeTasks = b.tasks.filter((t) =>
                  taskFilterRegex.some((r) => t.displayName.match(r)),
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
    taskFilterRegex,
  ]);

  return { buildVariants: buildVariantsResult, versions: versionsResult };
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
