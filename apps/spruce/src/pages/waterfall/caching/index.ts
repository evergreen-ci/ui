import { FieldMergeFunction, FieldReadFunction } from "@apollo/client";
import { WaterfallQuery } from "gql/generated/types";
import { VERSION_LIMIT } from "../constants";

export const readVersions = ((existing, { args, readField }) => {
  if (!existing) {
    return undefined;
  }

  const minOrder = args?.options?.minOrder ?? 0;
  let maxOrder = args?.options?.maxOrder ?? 0;
  const limit = args?.options?.limit ?? VERSION_LIMIT;
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

  const activeVersionIds = [];
  const allActiveVersions =
    readField<Set<string>>("allActiveVersions", existing) ?? new Set();

  // Count backwards for paginating backwards.
  if (minOrder) {
    for (let i = endIndex; i >= 0; i--) {
      const id = readField<string>("id", existingVersions[i]) ?? "";
      if (allActiveVersions.has(id)) {
        activeVersionIds.push(id);
        if (activeVersionIds.length === limit) {
          startIndex = i;
          // Handle unmatching leading versions
          i -= 1;
          while (
            i >= 0 &&
            !allActiveVersions.has(
              readField<string>("id", existingVersions[i]) ?? "",
            )
          ) {
            startIndex = i;
            i -= 1;
          }
          break;
        }
      }
    }
  }

  // Count forwards for paginating forwards.
  if (maxOrder) {
    for (let i = startIndex; i < existingVersions.length; i++) {
      const id = readField<string>("id", existingVersions[i]) ?? "";
      if (allActiveVersions.has(id)) {
        activeVersionIds.push(id);
        if (activeVersionIds.length === limit) {
          endIndex = i;
          break;
        }
      }
    }
    if (activeVersionIds.length < limit) {
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
      // Sort is only necessary for consistency in testing
      activeVersionIds: activeVersionIds.sort(),
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

  const existingActiveVersions =
    readField<Set<string>>("allActiveVersions", existing) ?? new Set();
  const incomingActiveVersions =
    readField<string[]>("activeVersionIds", pagination) ?? [];
  incomingActiveVersions.forEach((vId) => existingActiveVersions.add(vId));
  return {
    flattenedVersions: v,
    pagination,
    allActiveVersions: existingActiveVersions,
  };
}) satisfies FieldMergeFunction<
  WaterfallQuery["waterfall"] & { allActiveVersions?: Set<string> }
>;
