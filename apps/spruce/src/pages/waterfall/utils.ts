import { WaterfallVersionFragment } from "gql/generated/types";
import { WaterfallVersion } from "./types";

export const groupInactiveVersions = (
  versions: WaterfallVersionFragment[],
  versionHasActiveBuild: (version: WaterfallVersionFragment) => boolean,
) => {
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

  versions.forEach((version) => {
    if (version.activated && versionHasActiveBuild(version)) {
      pushActive(version);
    } else {
      pushInactive(version);
    }
  });

  return filteredVersions;
};
