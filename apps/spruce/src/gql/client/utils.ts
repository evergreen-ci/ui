import { ReadFieldFunction } from "@apollo/client/cache/core/types/common";
import {
  Version,
  WaterfallBuild,
  WaterfallBuildVariant,
} from "gql/generated/types";

const mergeBuildVariants = (
  existingBuildVariants: readonly WaterfallBuildVariant[],
  incomingBuildVariants: readonly WaterfallBuildVariant[],
  readField: ReadFieldFunction,
): WaterfallBuildVariant[] => {
  const newBuildVariants = existingBuildVariants.map((e, idx) => {
    const displayName = readField<string>("displayName", e) ?? "";
    const id = readField<string>("id", e) ?? "";
    const version = readField<string>("version", e) ?? "";
    const builds = readField<WaterfallBuild[]>("builds", e) ?? [];
    const buildsToAdd =
      readField<WaterfallBuild[]>("builds", incomingBuildVariants[idx]) ?? [];
    return {
      displayName,
      id,
      version,
      builds: [...builds, ...buildsToAdd],
    };
  });
  return newBuildVariants;
};

type ReadBuildVariantsProps = {
  versions: readonly Version[];
  buildVariants: readonly WaterfallBuildVariant[];
  readField: ReadFieldFunction;
};

const readBuildVariants = ({
  buildVariants,
  readField,
  versions,
}: ReadBuildVariantsProps): WaterfallBuildVariant[] => {
  const activeVersionIds: string[] = versions.map(
    (v) => readField<string>("id", v) ?? "",
  );
  const newBuildVariants = buildVariants.map((bv) => {
    const newBuilds: WaterfallBuild[] = [];
    const builds = readField<WaterfallBuild[]>("builds", bv) ?? [];
    builds.forEach((build) => {
      const version = readField<string>("version", build) ?? "";
      if (activeVersionIds.includes(version)) {
        newBuilds.push(build);
      }
    });
    return {
      ...bv,
      builds: newBuilds,
    };
  });

  return newBuildVariants;
};

type ReadVersionsProps = (
  | {
      minOrder: number;
      maxOrder?: never;
    }
  | {
      minOrder?: never;
      maxOrder: number;
    }
) & {
  versions: readonly Version[];
  readField: ReadFieldFunction;
};

// In this function, count up to 5 active versions and return the array
// that contains those 5 active versions along with any inactive versions
// that exist between them.
const readVersions = ({
  maxOrder,
  minOrder,
  readField,
  versions,
}: ReadVersionsProps): Version[] => {
  const idx = versions.findIndex((v) => {
    const versionOrder = readField<number>("order", v) ?? 0;
    if (minOrder) {
      return versionOrder === minOrder + 1;
    }
    if (maxOrder) {
      return versionOrder === maxOrder - 1;
    }
    return false;
  });

  let startIndex = maxOrder ? idx : 0;
  let endIndex = maxOrder ? 0 : idx;
  let numActivated = 0;

  // Count backwards for paginating backwards.
  if (minOrder) {
    for (let i = endIndex; i >= 0; i--) {
      if (readField<boolean>("activated", versions[i])) {
        numActivated += 1;
        if (numActivated === 5) {
          startIndex = i;
          break;
        }
      }
    }
  }

  // Count forwards for paginating forwards.
  if (maxOrder) {
    for (let i = startIndex; i < versions.length; i++) {
      if (readField<boolean>("activated", versions[i])) {
        numActivated += 1;
        if (numActivated === 5) {
          endIndex = i;
          break;
        }
      }
    }
  }

  // Add 1 because slice is [inclusive, exclusive).
  return versions.slice(startIndex, endIndex + 1);
};

export { readVersions, mergeBuildVariants, readBuildVariants };
