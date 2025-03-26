import { diff } from "deep-object-diff";
import { isObject, omitTypename, getObjectValueByPath } from "utils/object";
import { JSONObject, JSONValue } from "utils/object/types";
import { EventDiffLine } from "../../types";

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
  const beforeNoTypename = omitTypename(before);
  const afterNoTypename = omitTypename(after);

  const eventDiff = diff(beforeNoTypename || {}, afterNoTypename || {});
  const pathKeys: string[] = getChangedPaths(eventDiff);
  const eventDiffLines = pathKeys.map((key) => {
    let previousValue = beforeNoTypename;
    if (beforeNoTypename !== null && beforeNoTypename !== undefined) {
      previousValue = getObjectValueByPath(beforeNoTypename, key) as JSONObject;
    }
    const changedValue = getObjectValueByPath(eventDiff as JSONValue, key);

    const formattedKey = formatArrayElements(key);

    const line = {
      key: formattedKey,
      before: previousValue,
      after: changedValue,
    };

    return line;
  });

  return eventDiffLines.filter((el) => el !== null);
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

export { getChangedPaths, formatArrayElements, getEventDiffLines };
