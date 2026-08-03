import isEqual from "lodash.isequal";
import { isObject, omitTypename } from "utils/object";
import { JSONObject, JSONValue } from "utils/object/types";
import { EventDiffLine } from "../../types";

type ArrayDiffIndices = {
  after: number[];
  before: number[];
};

type ArrayDiffMatch = {
  afterIndex: number;
  beforeIndex: number;
};

type ArrayDiff = ArrayDiffIndices & {
  matches: ArrayDiffMatch[];
};

/**
 * `getEventDiffLines` is a utility function that returns an array of objects representing the differences between two objects.
 * @param before - The object before the event.
 * @param after - The object after the event.
 * @returns - An array of objects representing the differences between two objects.
 */
const getEventDiffLines = (
  before: JSONObject | undefined | null,
  after: JSONObject | undefined | null,
): EventDiffLine[] => {
  const beforeNoTypename = omitTypename(before) || {};
  const afterNoTypename = omitTypename(after) || {};
  return getSemanticDiffLines(beforeNoTypename, afterNoTypename);
};

/**
 * `getArrayDiff` aligns equal array values using their longest common
 * subsequence.
 * @param before - The array before the event.
 * @param after - The array after the event.
 * @returns The changed indices for each side of the diff.
 */
const getArrayDiff = (before: JSONValue[], after: JSONValue[]): ArrayDiff => {
  const lcsLengths = Array.from({ length: before.length + 1 }, () =>
    Array<number>(after.length + 1).fill(0),
  );

  for (let i = before.length - 1; i >= 0; i--) {
    for (let j = after.length - 1; j >= 0; j--) {
      lcsLengths[i][j] = isEqual(before[i], after[j])
        ? lcsLengths[i + 1][j + 1] + 1
        : Math.max(lcsLengths[i + 1][j], lcsLengths[i][j + 1]);
    }
  }

  const arrayDiff: ArrayDiff = { after: [], before: [], matches: [] };
  let beforeIndex = 0;
  let afterIndex = 0;

  while (beforeIndex < before.length && afterIndex < after.length) {
    if (isEqual(before[beforeIndex], after[afterIndex])) {
      arrayDiff.matches.push({ afterIndex, beforeIndex });
      beforeIndex += 1;
      afterIndex += 1;
    } else if (
      lcsLengths[beforeIndex + 1][afterIndex] >=
      lcsLengths[beforeIndex][afterIndex + 1]
    ) {
      arrayDiff.before.push(beforeIndex);
      beforeIndex += 1;
    } else {
      arrayDiff.after.push(afterIndex);
      afterIndex += 1;
    }
  }

  while (beforeIndex < before.length) {
    arrayDiff.before.push(beforeIndex);
    beforeIndex += 1;
  }

  while (afterIndex < after.length) {
    arrayDiff.after.push(afterIndex);
    afterIndex += 1;
  }

  return arrayDiff;
};

/**
 * `getArrayDiffIndices` returns the array values that differ after sequence
 * alignment.
 * @param before - The array before the event.
 * @param after - The array after the event.
 * @returns The changed indices for each side of the diff.
 */
const getArrayDiffIndices = (
  before: JSONValue[],
  after: JSONValue[],
): ArrayDiffIndices => {
  const { after: changedAfter, before: changedBefore } = getArrayDiff(
    before,
    after,
  );
  return { after: changedAfter, before: changedBefore };
};

const isJSONObject = (value: JSONValue): value is JSONObject =>
  isObject(value) && !(value instanceof Date);

const identityKeys = ["id", "_id", "key", "name", "identifier"];

const haveMatchingIdentity = (before: JSONValue, after: JSONValue): boolean => {
  if (!isJSONObject(before) || !isJSONObject(after)) {
    return false;
  }

  for (const key of identityKeys) {
    const beforeIdentity = before[key];
    const afterIdentity = after[key];
    const hasBeforeIdentity =
      beforeIdentity !== undefined &&
      beforeIdentity !== null &&
      typeof beforeIdentity !== "object";
    const hasAfterIdentity =
      afterIdentity !== undefined &&
      afterIdentity !== null &&
      typeof afterIdentity !== "object";

    if (hasBeforeIdentity || hasAfterIdentity) {
      return (
        hasBeforeIdentity &&
        hasAfterIdentity &&
        isEqual(beforeIdentity, afterIdentity)
      );
    }
  }

  return false;
};

const pairModifiedObjects = (
  before: JSONValue[],
  after: JSONValue[],
  unmatchedBefore: number[],
  unmatchedAfter: number[],
): ArrayDiffMatch[] => {
  const beforeObjects = unmatchedBefore.filter((index) =>
    isJSONObject(before[index]),
  );
  const availableAfterObjects = new Set(
    unmatchedAfter.filter((index) => isJSONObject(after[index])),
  );
  const matches: ArrayDiffMatch[] = [];

  beforeObjects.forEach((beforeIndex) => {
    const afterIndex = [...availableAfterObjects].find(
      (candidateIndex) =>
        !isEqual(before[beforeIndex], after[candidateIndex]) &&
        haveMatchingIdentity(before[beforeIndex], after[candidateIndex]),
    );

    if (afterIndex !== undefined) {
      matches.push({ afterIndex, beforeIndex });
      availableAfterObjects.delete(afterIndex);
    }
  });

  const availableBeforeObjects = beforeObjects.filter(
    (beforeIndex) =>
      !matches.some((match) => match.beforeIndex === beforeIndex),
  );
  if (availableBeforeObjects.length === 1 && availableAfterObjects.size === 1) {
    const beforeIndex = availableBeforeObjects[0];
    const afterIndex = [...availableAfterObjects][0];
    if (!isEqual(before[beforeIndex], after[afterIndex])) {
      matches.push({ afterIndex, beforeIndex });
    }
  }

  return matches;
};

const createDiffLine = (
  path: string,
  before: JSONValue,
  after: JSONValue,
): EventDiffLine => ({
  key: formatArrayElements(path),
  before,
  after,
});

const getObjectArrayDiffLines = (
  before: JSONValue[],
  after: JSONValue[],
  path: string,
): EventDiffLine[] => {
  const arrayDiff = getArrayDiff(before, after);
  const modifiedObjectMatches = pairModifiedObjects(
    before,
    after,
    arrayDiff.before,
    arrayDiff.after,
  );
  const matches = [...arrayDiff.matches, ...modifiedObjectMatches];
  const matchedBefore = new Set(matches.map(({ beforeIndex }) => beforeIndex));
  const matchedAfter = new Set(matches.map(({ afterIndex }) => afterIndex));
  const unmatchedBefore = arrayDiff.before.filter(
    (index) => !matchedBefore.has(index),
  );
  const unmatchedAfter = arrayDiff.after.filter(
    (index) => !matchedAfter.has(index),
  );

  if (unmatchedBefore.length > 0 && unmatchedAfter.length > 0) {
    return [createDiffLine(path, before, after)];
  }

  const matchedDiffLines = matches.flatMap(({ afterIndex, beforeIndex }) =>
    getSemanticDiffLines(
      before[beforeIndex],
      after[afterIndex],
      addDelimiter(path, String(afterIndex)),
    ),
  );
  const removedDiffLines = unmatchedBefore.map((index) =>
    createDiffLine(addDelimiter(path, String(index)), before[index], undefined),
  );
  const addedDiffLines = unmatchedAfter.map((index) =>
    createDiffLine(addDelimiter(path, String(index)), undefined, after[index]),
  );

  return [...matchedDiffLines, ...removedDiffLines, ...addedDiffLines];
};

const getSemanticDiffLines = (
  before: JSONValue,
  after: JSONValue,
  path = "",
): EventDiffLine[] => {
  if (isEqual(before, after)) {
    return [];
  }

  if (Array.isArray(before) && Array.isArray(after)) {
    const containsObjects = [...before, ...after].some(isJSONObject);
    return containsObjects
      ? getObjectArrayDiffLines(before, after, path)
      : [createDiffLine(path, before, after)];
  }

  if (isJSONObject(before) && isJSONObject(after)) {
    const keys = [...new Set([...Object.keys(before), ...Object.keys(after)])];
    return keys.flatMap((key) =>
      getSemanticDiffLines(before[key], after[key], addDelimiter(path, key)),
    );
  }

  return [createDiffLine(path, before, after)];
};

/**
 * `addDelimiter` is a helper function that adds a delimiter between two strings. If the first string is empty, it returns the second string.
 * @param a - string
 * @param b - string
 * @returns - The concatenated string.
 */
const addDelimiter = (a: string, b: string): string =>
  a.length > 0 ? `${a}.${b}` : b;

/**
 * `formatArrayElements` takes a string and replaces the dot notation with array notation.
 * @param eventKey - Takes a string and replaces the dot notation with array notation.
 * @returns - A string with array notation.
 * @example formatArrayElements("a.b.0.c") => "a.b[0].c"
 * @example formatArrayElements("a.b.1.c") => "a.b[1].c"
 */
const formatArrayElements = (eventKey: string): string =>
  eventKey.replace(/\.(\d+)/g, (_, digits) => `[${digits}]`);

export { getArrayDiffIndices, formatArrayElements, getEventDiffLines };
