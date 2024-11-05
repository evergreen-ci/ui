import { ReadFieldFunction } from "@apollo/client/cache/core/types/common";
import {
  WaterfallBuild,
  WaterfallBuildVariant,
  WaterfallVersionFragment,
} from "gql/generated/types";

type MergeBuildVariantsProps = {
  versions: readonly WaterfallVersionFragment[];
  existingBuildVariants: readonly WaterfallBuildVariant[];
  incomingBuildVariants: readonly WaterfallBuildVariant[];
  readField: ReadFieldFunction;
};

/**
 * `mergeBuildVariants` is used to merge existing and incoming build variants.
 * @param opts - object containing arguments to this function
 * @param opts.existingBuildVariants - existing build variants in the Apollo cache
 * @param opts.incomingBuildVariants - incoming build variants as a result of a GraphQL query
 * @param opts.versions - the versions that we've already merged in the merge function
 * @param opts.readField - function provided by Apollo to access fields from Reference objects
 * @returns an array of build variants that contains no duplicates and in the same order as its
 * corresponding version
 */
const mergeBuildVariants = ({
  existingBuildVariants,
  incomingBuildVariants,
  readField,
  versions,
}: MergeBuildVariantsProps): WaterfallBuildVariant[] => {
  const buildVariantsMap: {
    [displayName: string]: WaterfallBuildVariant;
  } = {};
  const buildsMap: {
    [displayName: string]: { [version: string]: WaterfallBuild };
  } = {};

  // Array to accummulate all builds. May contain duplicates.
  const allBuilds: WaterfallBuild[] = [];

  existingBuildVariants.forEach((e) => {
    const displayName = readField<string>("displayName", e) ?? "";
    buildVariantsMap[displayName] = e;
    buildsMap[displayName] = {};
    const builds = readField<WaterfallBuild[]>("builds", e) ?? [];
    allBuilds.push(...builds);
  });

  incomingBuildVariants.forEach((e) => {
    const displayName = readField<string>("displayName", e) ?? "";
    buildVariantsMap[displayName] = e;
    buildsMap[displayName] = {};
    const builds = readField<WaterfallBuild[]>("builds", e) ?? [];
    allBuilds.push(...builds);
  });

  allBuilds.forEach((b) => {
    const displayName = readField<string>("displayName", b) ?? "";
    const versionId = readField<string>("version", b) ?? "";
    buildsMap[displayName][versionId] = b;
  });

  const buildVariants = Object.keys(buildVariantsMap).map((displayName) => {
    const builds: WaterfallBuild[] = [];
    versions.forEach((v) => {
      const versionId = readField<string>("id", v) ?? "";
      const build = buildsMap[displayName][versionId];
      if (build) {
        builds.push(build);
      }
    });
    const id = readField<string>("id", buildVariantsMap[displayName]) ?? "";
    const version =
      readField<string>("version", buildVariantsMap[displayName]) ?? "";
    return {
      id,
      displayName,
      builds,
      version,
    };
  });

  return buildVariants;
};

export { mergeBuildVariants };
