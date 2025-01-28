import { GroupedVersion, Version } from "./types";

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
