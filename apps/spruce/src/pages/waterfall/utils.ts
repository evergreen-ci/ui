import { WaterfallQuery } from "gql/generated/types";
import { BuildVariant, GroupedVersion, Version } from "./types";

export const groupInactiveVersions = (
  versions: Version[],
  versionHasActiveBuild: (version: Version) => boolean,
) => {
  const filteredVersions: GroupedVersion[] = [];

  const pushInactive = (v: Version) => {
    if (!filteredVersions?.[filteredVersions.length - 1]?.inactiveVersions) {
      filteredVersions.push({ version: null, inactiveVersions: [] });
    }
    filteredVersions[filteredVersions.length - 1].inactiveVersions?.push(v);
  };

  const pushActive = (v: Version) => {
    filteredVersions.push({
      inactiveVersions: null,
      version: v,
    });
  };

  versions.forEach((version) => {
    if (version.activated && versionHasActiveBuild(version)) {
      pushActive(version);
    } else {
      pushInactive(version);
    }
  });

  return filteredVersions;
};

export const groupBuildVariants = (
  versions: WaterfallQuery["waterfall"]["flattenedVersions"],
): BuildVariant[] => {
  const bvs: Map<string, BuildVariant> = new Map();
  versions.forEach(({ activated, id, waterfallBuilds }) => {
    if (!activated) {
      return;
    }
    waterfallBuilds?.forEach(
      ({ buildVariant, displayName, id: buildId, tasks }) => {
        if (!bvs.has(buildVariant)) {
          bvs.set(buildVariant, {
            id: buildVariant,
            displayName,
            builds: [],
          });
        }

        const bv = bvs.get(buildVariant);
        bv?.builds?.push({
          id: buildId,
          version: id,
          tasks: tasks ?? [],
        });
      },
    );
  });

  // Although each version's build variants are sorted, we need to make sure the whole list is sorted once combined.
  const arr: BuildVariant[] = Array.from(bvs.values()).sort((a, b) => {
    if (a.displayName < b.displayName) {
      return -1;
    }
    if (a.displayName > b.displayName) {
      return 1;
    }
    return 0;
  });

  return arr;
};
