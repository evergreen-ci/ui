import { FieldMergeFunction, FieldReadFunction } from "@apollo/client";
import { WaterfallQuery } from "gql/generated/types";
import { VERSION_LIMIT } from "../constants";

export const readVersions = ((existing, { args, readField }) => {
  if (!existing) {
    return undefined;
  }

  const minOrder = args?.options?.minOrder ?? 0;
  const maxOrder = args?.options?.maxOrder ?? 0;
  const limit = args?.options?.limit ?? VERSION_LIMIT;
  const { mostRecentVersionOrder = 0 } =
    readField<WaterfallQuery["waterfall"]["pagination"]>(
      "pagination",
      existing,
    ) ?? {};

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
      if (readField<boolean>("activated", existingVersions[i])) {
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
      if (readField<boolean>("activated", existingVersions[i])) {
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
