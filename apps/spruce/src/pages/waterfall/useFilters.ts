import { useMemo } from "react";
import { WaterfallQuery, WaterfallVersionFragment } from "gql/generated/types";
import { useQueryParam } from "hooks/useQueryParam";
import { WaterfallFilterOptions } from "types/waterfall";

export const useFilters = (waterfall: WaterfallQuery["waterfall"]) => {
  const [requesters] = useQueryParam(
    WaterfallFilterOptions.Requesters,
    [] as string[],
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
  }, [requesters, waterfall, hasFilters]);

  const activeVersionIds = useMemo(
    () =>
      new Set(
        versions.reduce((ids, { version }) => {
          if (version) {
            ids.push(version.id);
          }
          return ids;
        }, [] as string[]),
      ),
    [versions],
  );

  const buildVariants = useMemo(() => {
    if (!hasFilters) {
      return waterfall.buildVariants;
    }

    const bvs: typeof waterfall.buildVariants = [];
    waterfall.buildVariants.forEach((bv) => {
      if (activeVersionIds.size !== bv.builds.length) {
        const activeBuilds: typeof bv.builds = [];
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
  }, [waterfall, activeVersionIds, hasFilters]);

  return { buildVariants, versions };
};

const matchesRequesters = (
  version: WaterfallVersionFragment,
  requesters: string[],
) => {
  if (!requesters.length) {
    return true;
  }
  return requesters.some((r) => r === version.requester);
};
