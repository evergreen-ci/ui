import { ReadFieldFunction } from "@apollo/client/cache/core/types/common";
import {
  Version,
  WaterfallBuild,
  WaterfallBuildVariant,
  WaterfallVersion,
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

const readBuildVariants = (
  buildVariants: readonly WaterfallBuildVariant[],
  startIdx: number,
  endIdx: number,
  readField: ReadFieldFunction,
): WaterfallBuildVariant[] => {
  const newBuildVariants = buildVariants.map((b) => {
    const displayName = readField<string>("displayName", b) ?? "";
    const id = readField<string>("id", b) ?? "";
    const version = readField<string>("version", b) ?? "";
    const builds = readField<WaterfallBuild[]>("builds", b) ?? [];

    return {
      displayName,
      id,
      version,
      builds: builds.slice(startIdx, endIdx),
    };
  });

  return newBuildVariants;
};

const findIndexMatchingOrder = (
  versions: readonly WaterfallVersion[],
  order: number,
  readField: ReadFieldFunction,
) => {
  const versionIdx = versions.findIndex((v) => {
    const activeVersion = readField<Version>("version", v) ?? {};
    const activeOrder = readField<number>("order", activeVersion) ?? 0;
    const inactiveVersions = readField<Version[]>("inactiveVersions", v) ?? [];
    return (
      activeOrder === order ||
      inactiveVersions?.some((i) => {
        const inactiveVersion = readField<Version>("version", i) ?? {};
        const inactiveOrder = readField<number>("order", inactiveVersion) ?? 0;
        return inactiveOrder === order;
      })
    );
  });
  return versionIdx;
};

export { mergeBuildVariants, readBuildVariants, findIndexMatchingOrder };
