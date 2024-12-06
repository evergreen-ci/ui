import { ReadFieldFunction } from "@apollo/client/cache/core/types/common";
import {
  WaterfallVersionFragment,
  WaterfallBuild,
  WaterfallBuildVariant,
} from "gql/generated/types";

type MergeBuildsProps = {
  existingBuilds: readonly WaterfallBuild[];
  incomingBuilds: readonly WaterfallBuild[];
  readField: ReadFieldFunction;
};

/**
 * `mergeBuilds` is used to merge existing and incoming builds.
 * @param opts - object containing arguments to this function
 * @param opts.existingBuilds - existing builds in the Apollo cache
 * @param opts.incomingBuilds - incoming builds as a result of a GraphQL query
 * @param opts.readField - function provided by Apollo to access fields from Reference objects
 * @returns an array of builds containing no duplicates and in descending sort by the
 * `order` field
 */
const mergeBuilds = ({
  existingBuilds,
  incomingBuilds,
  readField,
}: MergeBuildsProps): WaterfallBuild[] => {
  const builds = [...existingBuilds, ...incomingBuilds];
  const buildsMap = new Map<string, WaterfallBuild>();

  builds.forEach((b) => {
    const id = readField<string>("id", b) ?? "";
    buildsMap.set(id, b);
  });

  return Array.from(buildsMap.values()).sort((a, b) => {
    const aOrder = readField<number>("order", a) ?? 0;
    const bOrder = readField<number>("order", b) ?? 0;
    return bOrder - aOrder;
  });
};

type MergeBuildVariantsProps = {
  existingBuildVariants: readonly WaterfallBuildVariant[];
  incomingBuildVariants: readonly WaterfallBuildVariant[];
  readField: ReadFieldFunction;
};

/**
 * `mergeBuildVariants` is used to merge existing and incoming build variants.
 * @param opts - object containing arguments to this function
 * @param opts.existingBuildVariants - existing build variants in the Apollo cache
 * @param opts.incomingBuildVariants - incoming build variants as a result of a GraphQL query
 * @param opts.readField - function provided by Apollo to access fields from Reference objects
 * @returns an array of build variants containing no duplicates and in descending sort by the
 * `order` field
 */
const mergeBuildVariants = ({
  existingBuildVariants,
  incomingBuildVariants,
  readField,
}: MergeBuildVariantsProps): WaterfallBuildVariant[] => {
  const buildVariants = [...existingBuildVariants, ...incomingBuildVariants];

  const buildVariantsMap = new Map<string, WaterfallBuildVariant>();

  buildVariants.forEach((bv) => {
    const buildVariantId = readField<string>("id", bv) ?? "";

    const mapItem = buildVariantsMap.get(buildVariantId);

    if (mapItem) {
      const existingBuilds =
        readField<WaterfallBuild[]>("builds", mapItem) ?? [];
      const incomingBuilds = readField<WaterfallBuild[]>("builds", bv) ?? [];
      const mergedBuilds = mergeBuilds({
        existingBuilds,
        incomingBuilds,
        readField,
      });
      buildVariantsMap.set(buildVariantId, { ...bv, builds: mergedBuilds });
    } else {
      buildVariantsMap.set(buildVariantId, bv);
    }
  });
  return Array.from(buildVariantsMap.values());
};

type MergeVersionsProps = {
  existingVersions: readonly WaterfallVersionFragment[];
  incomingVersions: readonly WaterfallVersionFragment[];
  readField: ReadFieldFunction;
};

/**
 * `mergeVersions` is used to merge existing and incoming versions.
 * @param opts - object containing arguments to this function
 * @param opts.existingVersions - existing versions in the Apollo cache
 * @param opts.incomingVersions - incoming versions as a result of a GraphQL query
 * @param opts.readField - function provided by Apollo to access fields from Reference objects
 * @returns an array of versions (both active or inactive) that contains no duplicates and in
 * descending sort by the `order` field
 */
const mergeVersions = ({
  existingVersions,
  incomingVersions,
  readField,
}: MergeVersionsProps): WaterfallVersionFragment[] => {
  const versions = [...existingVersions, ...incomingVersions];

  // Use a map to enforce that there are no duplicates.
  const versionsMap = new Map<number, WaterfallVersionFragment>();
  versions.forEach((v) => {
    const order = readField<number>("order", v) ?? 0;
    versionsMap.set(order, v);
  });

  return Array.from(versionsMap.values()).sort((a, b) => {
    const aOrder = readField<number>("order", a) ?? 0;
    const bOrder = readField<number>("order", b) ?? 0;
    return bOrder - aOrder;
  });
};

export { mergeBuildVariants, mergeVersions, mergeBuilds };
