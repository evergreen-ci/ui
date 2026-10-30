import { FieldReadFunction } from "@apollo/client";
import {
  CachedWaterfall,
  Waterfall,
  getCacheOptions,
  getVersionId,
  getVersionOrder,
} from "./utils";

export const readVersions: FieldReadFunction<CachedWaterfall, Waterfall> = (
  existing,
  { args, readField },
) => {
  if (!existing) {
    return undefined;
  }

  const { date, limit, maxOrder, minOrder, revision } = getCacheOptions(args);
  if (date || revision) {
    return undefined;
  }
  let anchor = existing.mostRecentVersionOrder;
  if (minOrder) {
    anchor = minOrder + 1;
  } else if (maxOrder) {
    anchor = maxOrder - 1;
  }
  const range = existing.coverage.find(
    (covered) => covered.minOrder <= anchor && anchor <= covered.maxOrder,
  );
  if (!range) {
    return undefined;
  }

  const candidates = existing.versions.filter((version) => {
    const order = getVersionOrder(version, readField);
    return (
      range.minOrder <= order &&
      order <= range.maxOrder &&
      (minOrder ? order >= anchor : order <= anchor)
    );
  });
  const isActive = (version: Waterfall["versions"][number]) =>
    existing.allActiveVersions.has(getVersionId(version, readField));
  let startIndex = 0;
  let endIndex = candidates.length - 1;
  let activeCount = 0;
  if (minOrder) {
    for (let i = endIndex; i >= 0; i--) {
      if (isActive(candidates[i])) {
        activeCount += 1;
        if (activeCount === limit) {
          startIndex = i;
          while (startIndex > 0 && !isActive(candidates[startIndex - 1])) {
            startIndex -= 1;
          }
          break;
        }
      }
    }
  } else {
    for (let i = 0; i < candidates.length; i++) {
      if (isActive(candidates[i])) {
        activeCount += 1;
        if (activeCount === limit) {
          endIndex = i;
          while (
            endIndex < candidates.length - 1 &&
            !isActive(candidates[endIndex + 1])
          ) {
            endIndex += 1;
          }
          break;
        }
      }
    }
  }

  // A completed scan can be sparse or empty even when more history exists.
  const boundary = minOrder ? range.upper : range.lower;
  const completedScan =
    boundary.limit >= limit &&
    (minOrder ? anchor <= boundary.anchor : anchor >= boundary.anchor);
  if (activeCount < limit && boundary.hasMore && !completedScan) {
    return undefined;
  }
  const versions = candidates.slice(startIndex, endIndex + 1);
  const startsAtBoundary = minOrder
    ? startIndex === 0
    : anchor === range.maxOrder;
  const endsAtBoundary = minOrder
    ? anchor === range.minOrder
    : endIndex === candidates.length - 1;
  const firstOrder = versions[0]
    ? getVersionOrder(versions[0], readField)
    : anchor;
  const last = versions.at(-1);
  const lastOrder = last ? getVersionOrder(last, readField) : anchor;

  return {
    __typename: existing.__typename,
    pagination: {
      __typename: "WaterfallPagination",
      mostRecentVersionOrder: existing.mostRecentVersionOrder,
      activeVersionIds: versions
        .filter(isActive)
        .map((version) => getVersionId(version, readField)),
      hasPrevPage: startsAtBoundary ? range.upper.hasMore : true,
      prevPageOrder: startsAtBoundary ? range.upper.cursor : firstOrder,
      hasNextPage: endsAtBoundary ? range.lower.hasMore : true,
      nextPageOrder: endsAtBoundary ? range.lower.cursor : lastOrder,
    },
    versions,
  };
};
