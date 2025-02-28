import { FieldMergeFunction, FieldReadFunction } from "@apollo/client";
import { ReadFieldFunction } from "@apollo/client/cache/core/types/common";
import { Unpacked } from "@evg-ui/lib/types/utils";
import { WaterfallQuery } from "gql/generated/types";
import { VERSION_LIMIT } from "../constants";

type Version = Unpacked<WaterfallQuery["waterfall"]["flattenedVersions"]>;
type WaterfallBuild = NonNullable<Unpacked<Version["waterfallBuilds"]>>;

const makeFilterRegex = (filters: string[]) =>
  filters.reduce<RegExp[]>((accum, curr) => {
    let regex;
    try {
      regex = new RegExp(curr, "i");
    } catch {
      return accum;
    }
    return [...accum, regex];
  }, []);

const hasMatchingRequester = (
  argsRequester: string,
  version: Version,
  readField: ReadFieldFunction,
) => {
  if (argsRequester.length === 0 || argsRequester[0] === "") {
    return true;
  }
  const requester = readField<Version["requester"]>("requester", version) ?? "";
  if (argsRequester.includes(requester)) {
    return true;
  }
};

const hasMatchingBv = (
  argsVariant: string[],
  version: Version,
  readField: ReadFieldFunction,
) => {
  if (argsVariant.length === 0 || argsVariant[0] === "") {
    return true;
  }

  const bvRegex = makeFilterRegex(argsVariant);
  const waterfallBuilds =
    readField<Version["waterfallBuilds"]>("waterfallBuilds", version) ?? [];

  let hasMatch = false;
  for (let i = 0; i < waterfallBuilds.length; i++) {
    const buildVariant =
      readField<WaterfallBuild["buildVariant"]>(
        "buildVariant",
        waterfallBuilds[0],
      ) ?? "";

    const displayName =
      readField<WaterfallBuild["displayName"]>(
        "buildVariant",
        waterfallBuilds[0],
      ) ?? "";

    // I think we should check if the build is actually activated, but we don't have access to this field currently.

    if (
      bvRegex.length &&
      (bvRegex.some((r) => displayName.match(r)) ||
        bvRegex.some((r) => buildVariant.match(r)))
    ) {
      hasMatch = true;
    }
  }
  return hasMatch;
};

export const readVersions = ((existing, { args, readField }) => {
  if (!existing) {
    return undefined;
  }

  const minOrder = args?.options?.minOrder ?? 0;
  let maxOrder = args?.options?.maxOrder ?? 0;
  const limit = args?.options?.limit ?? VERSION_LIMIT;
  const requesters = (args?.options?.requesters ?? "").split(",") ?? [];
  const buildVariants = (args?.options?.variants ?? "").split(",") ?? [];

  console.log({ requesters, buildVariants });
  const date = args?.options?.date ?? "";
  const revision = args?.options?.revision ?? "";

  const { mostRecentVersionOrder = 0 } =
    readField<WaterfallQuery["waterfall"]["pagination"]>(
      "pagination",
      existing,
    ) ?? {};

  // Leverage cache if there are no other query params.
  if (minOrder === 0 && maxOrder === 0 && !date && !revision) {
    maxOrder = mostRecentVersionOrder + 1;
  }

  const existingVersions =
    readField<WaterfallQuery["waterfall"]["flattenedVersions"]>(
      "flattenedVersions",
      existing,
    ) ?? [];

  const idx = existingVersions.findIndex((v) => {
    const versionOrder = readField<number>("order", v) ?? 0;
    if (minOrder) {
      return versionOrder - 1 === minOrder;
    }
    if (maxOrder) {
      return versionOrder + 1 === maxOrder;
    }
    return false;
  });

  if (idx === -1) {
    return undefined;
  }

  let startIndex = maxOrder ? idx : 0;
  let endIndex = maxOrder ? existingVersions.length : idx;
  let numActivated = 0;

  // Count backwards for paginating backwards.
  if (minOrder) {
    for (let i = endIndex; i >= 0; i--) {
      const currVersion = existingVersions[i];
      if (
        readField<boolean>("activated", currVersion) &&
        hasMatchingBv(buildVariants, currVersion, readField) &&
        hasMatchingRequester(requesters, currVersion, readField)
      ) {
        numActivated += 1;
        if (numActivated === limit) {
          startIndex = i;
          if (i > 0) {
            // Check for leading inactive versions
            if (
              [...Array(i).keys()].every(
                (index) =>
                  readField<boolean>("activated", existingVersions[index]) ===
                  false,
              )
            ) {
              startIndex = 0;
            }
          }
          break;
        }
      }
    }
  }

  // Count forwards for paginating forwards.
  if (maxOrder) {
    for (let i = startIndex; i < existingVersions.length; i++) {
      const currVersion = existingVersions[i];
      if (
        readField<boolean>("activated", currVersion) &&
        hasMatchingBv(buildVariants, currVersion, readField) &&
        hasMatchingRequester(requesters, currVersion, readField)
      ) {
        numActivated += 1;
        if (numActivated === limit) {
          endIndex = i;
          break;
        }
      }
    }
    if (numActivated < limit) {
      return undefined;
    }
  }

  // Add 1 because slice is [inclusive, exclusive).
  const flattenedVersions = existingVersions.slice(startIndex, endIndex + 1);

  const activeVersionIds = flattenedVersions.map(
    (v) => readField<string>("id", v) ?? "",
  );

  const zerothOrder = readField<number>("order", flattenedVersions[0]) ?? 0;
  const prevOrderNumber =
    mostRecentVersionOrder === zerothOrder ? 0 : zerothOrder;

  const lastVersionOrder =
    readField<number>(
      "order",
      flattenedVersions[flattenedVersions.length - 1],
    ) ?? 0;
  const nextOrderNumber = lastVersionOrder === 1 ? 0 : lastVersionOrder;

  return {
    flattenedVersions,
    pagination: {
      activeVersionIds,
      mostRecentVersionOrder,
      prevPageOrder: prevOrderNumber,
      nextPageOrder: nextOrderNumber,
      hasNextPage: nextOrderNumber > 0,
      hasPrevPage: prevOrderNumber > 0,
    },
  };
}) satisfies FieldReadFunction<WaterfallQuery["waterfall"]>;

export const mergeVersions = ((existing, incoming, { readField }) => {
  const existingVersions =
    readField<WaterfallQuery["waterfall"]["flattenedVersions"]>(
      "flattenedVersions",
      existing,
    ) ?? [];
  const incomingVersions =
    readField<WaterfallQuery["waterfall"]["flattenedVersions"]>(
      "flattenedVersions",
      incoming,
    ) ?? [];
  const versions = [...existingVersions, ...incomingVersions];

  // Use a map to enforce that there are no duplicates.
  const versionsMap = new Map();
  versions.forEach((v) => {
    const order = readField<number>("order", v) ?? 0;
    versionsMap.set(order, v);
  });

  const v = Array.from(versionsMap.values()).sort((a, b) => {
    const aOrder = readField<number>("order", a) ?? 0;
    const bOrder = readField<number>("order", b) ?? 0;
    return bOrder - aOrder;
  });

  const pagination = readField<WaterfallQuery["waterfall"]["pagination"]>(
    "pagination",
    incoming,
  ) ?? {
    activeVersionIds: [],
    hasNextPage: true,
    hasPrevPage: true,
    mostRecentVersionOrder: 0,
    nextPageOrder: 0,
    prevPageOrder: 0,
  };
  return {
    flattenedVersions: v,
    pagination,
  };
}) satisfies FieldMergeFunction<WaterfallQuery["waterfall"]>;
