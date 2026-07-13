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
 * `getArrayDiff` aligns two arrays using their longest common subsequence. It
 * also pairs modified objects by stable identity so their nested changes can be
 * highlighted.
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

  const unmatchedBeforeObjects = arrayDiff.before.filter((index) =>
    isObject(before[index]),
  );
  const unmatchedAfterObjects = new Set(
    arrayDiff.after.filter((index) => isObject(after[index])),
  );

  unmatchedBeforeObjects.forEach((unmatchedBeforeIndex) => {
    const matchingAfterIndex = [...unmatchedAfterObjects].find(
      (unmatchedAfterIndex) =>
        !isEqual(before[unmatchedBeforeIndex], after[unmatchedAfterIndex]) &&
        haveMatchingIdentity(
          before[unmatchedBeforeIndex],
          after[unmatchedAfterIndex],
        ),
    );

    if (matchingAfterIndex !== undefined) {
      arrayDiff.matches.push({
        afterIndex: matchingAfterIndex,
        beforeIndex: unmatchedBeforeIndex,
      });
      unmatchedAfterObjects.delete(matchingAfterIndex);
    }
  });

  if (
    unmatchedBeforeObjects.length === 1 &&
    unmatchedAfterObjects.size === 1 &&
    !isEqual(
      before[unmatchedBeforeObjects[0]],
      after[[...unmatchedAfterObjects][0]],
    ) &&
    !arrayDiff.matches.some(
      ({ beforeIndex: matchedBeforeIndex }) =>
        matchedBeforeIndex === unmatchedBeforeObjects[0],
    )
  ) {
    arrayDiff.matches.push({
      afterIndex: [...unmatchedAfterObjects][0],
      beforeIndex: unmatchedBeforeObjects[0],
    });
  }

  return arrayDiff;
};

const identityKeys = ["id", "_id", "key", "name", "identifier"];

const haveMatchingIdentity = (before: JSONValue, after: JSONValue): boolean => {
  if (!isObject(before) || !isObject(after)) {
    return false;
  }

  return identityKeys.some((key) => {
    const beforeIdentity = before[key];
    const afterIdentity = after[key];
    return (
      beforeIdentity !== undefined &&
      beforeIdentity !== null &&
      typeof beforeIdentity !== "object" &&
      isEqual(beforeIdentity, afterIdentity)
    );
  });
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
  const matchedBefore = new Set(
    arrayDiff.matches.map(({ beforeIndex }) => beforeIndex),
  );
  const matchedAfter = new Set(
    arrayDiff.matches.map(({ afterIndex }) => afterIndex),
  );

  const matchedDiffLines = arrayDiff.matches.flatMap(
    ({ afterIndex, beforeIndex }) =>
      getSemanticDiffLines(
        before[beforeIndex],
        after[afterIndex],
        addDelimiter(path, String(afterIndex)),
      ),
  );
  const removedDiffLines = arrayDiff.before
    .filter((index) => !matchedBefore.has(index))
    .map((index) =>
      createDiffLine(
        addDelimiter(path, String(index)),
        before[index],
        undefined,
      ),
    );
  const addedDiffLines = arrayDiff.after
    .filter((index) => !matchedAfter.has(index))
    .map((index) =>
      createDiffLine(
        addDelimiter(path, String(index)),
        undefined,
        after[index],
      ),
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
 * `getChangedPaths` walks the object returned by `deep-object-diff` and returns an array of strings representing the paths to the changed properties.
 * @param eventObj - The object returned by `deep-object-diff`.
 * @returns - An array of strings representing the paths to the changed properties.
 */
const getChangedPaths = (eventObj: unknown): string[] => {
  if (!isObject(eventObj)) {
    return [];
  }
  const recursivelyWalkObject = (obj: object = {}, head = ""): string[] =>
    Object.entries(obj).reduce<string[]>((event, [key, value]) => {
      const fullPath = addDelimiter(head, key);
      return isObject(value)
        ? event.concat(recursivelyWalkObject(value, fullPath))
        : event.concat(fullPath);
    }, []);
  return recursivelyWalkObject(eventObj);
};

/**
 * `formatArrayElements` takes a string and replaces the dot notation with array notation.
 * @param eventKey - Takes a string and replaces the dot notation with array notation.
 * @returns - A string with array notation.
 * @example formatArrayElements("a.b.0.c") => "a.b[0].c"
 * @example formatArrayElements("a.b.1.c") => "a.b[1].c"
 */
const formatArrayElements = (eventKey: string): string =>
  eventKey.replace(/\.(\d+)/g, (_, digits) => `[${digits}]`);

export {
  getArrayDiff,
  getArrayDiffIndices,
  getChangedPaths,
  formatArrayElements,
  getEventDiffLines,
};
