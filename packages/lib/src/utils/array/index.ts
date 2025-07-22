/**
 * `arraySymmetricDifference` takes in two arrays and returns only the elements not in common between the two arrays.
 * @param a - The first array
 * @param b - The second array
 * @returns The elements not in common between the two arrays
 * @example arraySymmetricDifference([1, 2, 3], [2, 3, 4]) // [1, 4]
 */
export const arraySymmetricDifference = <T>(a: T[], b: T[]) => {
  if (typeof a[0] === "object" || typeof b[0] === "object") {
    throw new TypeError("arraySymmetricDifference does not support objects");
  }
  const setA = new Set(a);
  const setB = new Set(b);
  const difference = Array.from(
    new Set(a.concat(b).filter((x) => !setA.has(x) || !setB.has(x))),
  );

  return difference;
};

/**
 * `arraySetDifference` returns the elements in a that are not in b
 * @param a - The first array
 * @param b - The second array
 * @returns The elements in a that are not in b
 * @example arraySetDifference([1, 2, 3], [2, 3, 4]) // [1]
 */
export const arraySetDifference = <T>(a: T[], b: T[]) => {
  if (typeof a[0] === "object" || typeof b[0] === "object") {
    throw new TypeError("arraySetDifference does not support objects");
  }
  const setA = new Set(a);
  const setB = new Set(b);
  const difference = Array.from(setA).filter((x) => !setB.has(x));
  return difference;
};

/**
 * `conditionalToArray` takes in a generic value and transforms it into an array if shouldBeArray is true.
 * The value remains unchanged if it is already an array, or if shouldBeArray is false.
 * @param value - The value to be transformed
 * @param shouldBeArray - A boolean indicating whether or not the value should be transformed into an array
 * @returns The transformed value
 */
export const conditionalToArray = <T>(
  value: T | T[],
  shouldBeArray: boolean,
): T[] => {
  if (shouldBeArray) {
    return Array.isArray(value) ? value : [value];
  }
  return value as T[];
};
