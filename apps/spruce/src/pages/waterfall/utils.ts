import { Version, WaterfallVersion } from "gql/generated/types";

export const groupInactiveVersions = (versions: Version[]) => {
  const waterfallVersions: WaterfallVersion[] = [];
  let i = 0;

  while (i < versions.length) {
    if (versions[i].activated) {
      waterfallVersions.push({
        version: versions[i],
      });
      i += 1;
    } else {
      const inactiveGroup: Version[] = [];
      while (i < versions.length && !versions[i].activated) {
        inactiveGroup.push(versions[i]);
        i += 1;
      }
      waterfallVersions.push({
        inactiveVersions: inactiveGroup,
      });
    }
  }
  return waterfallVersions;
};
