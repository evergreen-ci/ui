/**
 * `isObject` is a type guard that checks if a value is an object.
 * @param val - The value to check.
 * @returns - A boolean indicating if the value is an object.
 */
const isObject = (val: unknown): val is Record<string, unknown> =>
  val !== null && typeof val === "object" && !Array.isArray(val);

/**
 * `addDelimiter` is a helper function that adds a delimiter between two strings. If the first string is empty, it returns the second string.
 * @param a - string
 * @param b - string
 * @returns - The concatenated string.
 */
const addDelimiter = (a: string, b: string): string => (a ? `${a}.${b}` : b);

/**
 * `getDiffProperties` walks the object returned by `deep-object-diff` and returns an array of strings representing the paths to the changed properties.
 * @param eventObj - The object returned by `deep-object-diff`.
 * @returns - An array of strings representing the paths to the changed properties.
 */
const getDiffProperties = (eventObj: unknown): string[] => {
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

export { getDiffProperties, formatArrayElements };
