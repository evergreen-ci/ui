import { ReadFieldFunction } from "@apollo/client/cache/core/types/common";
import { WaterfallVersionFragment } from "gql/generated/types";

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
  // Order should be unique - the map will enforce that there are no duplicates.
  const versionsMap: { [order: number]: WaterfallVersionFragment } = {};

  existingVersions.forEach((e) => {
    const order = readField<number>("order", e) ?? 0;
    versionsMap[order] = e;
  });
  incomingVersions.forEach((i) => {
    const order = readField<number>("order", i) ?? 0;
    versionsMap[order] = i;
  });

  return Object.values(versionsMap).sort((a, b) => {
    const aOrder = readField<number>("order", a) ?? 0;
    const bOrder = readField<number>("order", b) ?? 0;
    return bOrder - aOrder;
  });
};

export { mergeVersions };
