import { useMemo } from "react";
import {
  WaterfallBuild,
  WaterfallBuildVariant,
  WaterfallQuery,
  WaterfallVersionFragment,
} from "gql/generated/types";
import { useQueryParam } from "hooks/useQueryParam";
import { WaterfallFilterOptions } from "types/waterfall";

export const useFilters = (waterfall: WaterfallQuery["waterfall"]) => {
  const [requesters] = useQueryParam<string[]>(
    WaterfallFilterOptions.Requesters,
    [],
  );

  const hasFilters = useMemo(() => requesters.length, [requesters]);

  const versions = useMemo(() => {
    if (!hasFilters) {
      return waterfall.versions;
    }

    const filteredVersions: typeof waterfall.versions = [];

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

    waterfall.versions.forEach(({ inactiveVersions, version }) => {
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
  }, [hasFilters, requesters, waterfall]);

  const activeVersionIds = useMemo(
    () =>
      new Set(
        versions.reduce((ids: string[], { version }) => {
          if (version) {
            ids.push(version.id);
          }
          return ids;
        }, []),
      ),
    [versions],
  );

  const buildVariants = useMemo(() => {
    if (!hasFilters) {
      return waterfall.buildVariants;
    }

    const bvs: WaterfallBuildVariant[] = [];
    waterfall.buildVariants.forEach((bv) => {
      if (activeVersionIds.size !== bv.builds.length) {
        const activeBuilds: WaterfallBuild[] = [];
        bv.builds.forEach((b) => {
          if (activeVersionIds.has(b.version)) {
            activeBuilds.push(b);
          }
        });
        if (activeBuilds.length) {
          bvs.push({ ...bv, builds: activeBuilds });
        }
      } else {
        bvs.push(bv);
      }
    });
    return bvs;
  }, [activeVersionIds, hasFilters, waterfall]);

  return { buildVariants, versions };
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
