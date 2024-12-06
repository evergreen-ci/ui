import { WaterfallVersionFragment } from "gql/generated/types";
import { Build, BuildVariant, WaterfallVersion } from "./types";

export const groupBuilds = (builds: Build[]): BuildVariant[] => {
  const idToBuilds: { [index: string]: Build[] } = {};

  builds.forEach((b) => {
    if (!idToBuilds[b.buildVariant]) {
      idToBuilds[b.buildVariant] = [];
    }
    idToBuilds[b.buildVariant].push(b);
  });

  return Object.entries(idToBuilds).map(([k, v]) => ({
    id: k,
    displayName: v[0].displayName,
    builds: v,
  }));
};

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
