import { diff } from "deep-object-diff";
import { omitTypename, getObjectValueByPath } from "utils/object";
import { JSONObject, JSONValue } from "utils/object/types";
import { EventDiffLine } from "../types";
import { formatArrayElements, getDiffProperties } from "./utils";

/**
 * `getEventDiffLines` is a utility function that returns an array of objects representing the differences between two objects.
 * @param before - The object before the event.
 * @param after - The object after the event.
 * @returns - An array of objects representing the differences between two objects.
 */
export const getEventDiffLines = (
  before: JSONObject | undefined,
  after: JSONObject | undefined,
): EventDiffLine[] => {
  const beforeNoTypename = omitTypename(before);
  const afterNoTypename = omitTypename(after);

  const eventDiff = diff(beforeNoTypename || {}, afterNoTypename || {});
  const pathKeys: string[] = getDiffProperties(eventDiff);
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
