import { WaterfallVersionFragment } from "gql/generated/types";
import { WaterfallVersion } from "./types";

export const groupInactiveVersions = (versions: WaterfallVersionFragment[]) => {
  const waterfallVersions: WaterfallVersion[] = [];
  let i = 0;

  while (i < versions.length) {
    if (versions[i].activated) {
      waterfallVersions.push({
        inactiveVersions: null,
        version: versions[i],
      });
      i += 1;
    } else {
      const inactiveGroup: WaterfallVersionFragment[] = [];
      while (i < versions.length && !versions[i].activated) {
        inactiveGroup.push(versions[i]);
        i += 1;
      }
      waterfallVersions.push({
        inactiveVersions: inactiveGroup,
        version: null,
      });
    }
  }
  return waterfallVersions;
};
