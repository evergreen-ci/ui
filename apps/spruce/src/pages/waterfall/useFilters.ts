import { useMemo } from "react";
import {
  WaterfallBuild,
  WaterfallBuildVariant,
  WaterfallVersionFragment,
} from "gql/generated/types";
import { useQueryParam } from "hooks/useQueryParam";
import { WaterfallFilterOptions } from "types/waterfall";
import { WaterfallVersion } from "./types";
import { groupInactiveVersions } from "./utils";

type UseFiltersProps = {
  buildVariants: WaterfallBuildVariant[];
  flattenedVersions: WaterfallVersionFragment[];
};

export const useFilters = ({
  buildVariants,
  flattenedVersions,
}: UseFiltersProps) => {
  const [requesters] = useQueryParam<string[]>(
    WaterfallFilterOptions.Requesters,
    [],
  );

  const [buildVariantFilter] = useQueryParam<string[]>(
    WaterfallFilterOptions.BuildVariant,
    [],
  );

  const hasFilters = useMemo(
    () => requesters.length || buildVariantFilter.length,
    [buildVariantFilter, requesters],
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
    () =>
      buildVariantFilter.reduce<RegExp[]>((accum, curr) => {
        let variantRegex;
        try {
          variantRegex = new RegExp(curr, "i");
        } catch {
          return accum;
        }
        return [...accum, variantRegex];
      }, []),
    [buildVariantFilter],
  );

  const buildVariantsResult = useMemo(() => {
    if (!hasFilters) {
      return buildVariants;
    }

    const bvs: WaterfallBuildVariant[] = [];
    buildVariants.forEach((bv) => {
      const passesBVFilter =
        !buildVariantFilterRegex.length ||
        buildVariantFilterRegex.some((r) => bv.displayName.match(r));
      if (passesBVFilter) {
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
      }
    });
    return bvs;
  }, [activeVersionIds, hasFilters, buildVariants, buildVariantFilterRegex]);

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
