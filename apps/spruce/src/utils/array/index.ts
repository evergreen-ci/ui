import { Unpacked } from "@evg-ui/lib/types/utils";

/**
 * `toggleArray` takes in an array of values regardless of type and a new value and safely inserts the value if it doesn't exist in the array.
 * It removes the value from the array if it already exists
 * @param value - The value to insert or remove into the array.
 * @param array - The array to insert the value into.
 * @returns The new array with the value inserted.
 * @example
 * const array = [1, 2, 3];
 * const newArray = toggleArray(2, array);
 * // newArray = [1, 3]
 * @example
 * const array = [1, 2, 3];
 * const newArray = toggleArray(4, array);
 * // newArray = [1, 2, 3, 4]
 */
export const toggleArray = <T>(value: T, array: T[]) => {
  const tempArray = [...array];
  const idIndex = tempArray.findIndex(
    (e) => JSON.stringify(value) === JSON.stringify(e),
  );
  if (idIndex !== -1) {
    tempArray.splice(idIndex, 1);
  } else {
    tempArray.push(value);
  }
  return tempArray;
};

/**
 * `deduplicatedAppend` takes in an array of values regardless of type and a new value and safely inserts the value if it doesn't exist in the array.
 * if it does exist it will do nothing
 * @param value - The value to insert into the array.
 * @param array - The array to insert the value into.
 * @returns The new array with the value inserted.
 * @example
 * const array = [1, 2, 3];
 * const newArray = deduplicatedAppend(2, array);
 * // newArray = [1, 2, 3]
 * const newArray2 = deduplicatedAppend(4, array);
 * // newArray2 = [1, 2, 3, 4]
 */
export const deduplicatedAppend = <T>(value: T, array: T[]) => {
  let tempArray = new Set(array);
  tempArray = tempArray.add(value);
  return Array.from(tempArray);
};

/**
 * `convertArrayToObject` takes an array of objects and a key
 * and returns an object using the provided value of the key as a key and the rest of the object as the value
 * @param array - The array of objects to convert to an object
 * @param key - The key to use as the key of the object
 * @returns The object created from the array
 */
export const convertArrayToObject = <T extends Record<string, any>>(
  array: T[],
  key: keyof T,
): Record<string, T> => {
  if (!Array.isArray(array)) {
    return {};
  }
  return array.reduce<Record<string, T>>((obj, item) => {
    const keyValue = item[key];

    if (typeof keyValue !== "string") {
      throw new TypeError("Object keys must be of type `string`");
    }

    return {
      ...obj,
      [keyValue]: item,
    };
  }, {});
};

/**
 * `convertObjectToArray` takes an object and returns an array with each of the entries in the object as a value in the array
 * If the entry is an array it will also split up the indices of the array into the array
 * @param obj - The object to convert to an array
 * @returns The array created from the object
 * @example
 * const obj = {
 * a: 1,
 * b: [2, 3],
 * c: 4
 * }
 * const array = convertObjectToArray(obj)
 * // array = [{key: 'a', value: 1}, {key: 'b', value: 2}, {key: 'b', value: 3}, {key: 'c', value: 4}]
 */
export const convertObjectToArray = <T extends object>(
  obj: T,
): KeyValue<T>[] => {
  // @ts-expect-error: FIXME. This comment was added by an automated script.
  const result = [];
  // @ts-expect-error: FIXME. This comment was added by an automated script.
  if (obj === undefined) return result;
  const objectEntries = Object.entries(obj);
  return objectEntries.flatMap(([key, value]) => {
    const entries = toArray(value);

    return entries.map(
      (v) =>
        ({
          key,
          value: v,
        }) as KeyValue<T>,
    );
  });
};

type KeyValue<T> = {
  key: string;
  value: Unpacked<T[keyof T]>;
};

/**
 * `mapStringArrayToObject` takes an array of strings and a value and returns an object with a string as the key and the value as the value
 * @param array - The string array to convert to an object
 * @param v - The value to use as the value of the object or a function that generates a value from the key
 * @returns The object created from the array
 * @example
 * const array = ['a', 'b', 'c']
 * const obj = mapStringArrayToObject(array, 1)
 * // obj = {a: 1, b: 1, c: 1}
 * @example
 * const array = ['a', 'b', 'c']
 * const obj = mapStringArrayToObject(array, (key) => key.toUpperCase())
 * // obj = {a: 'A', b: 'B', c: 'C'}
 */
export const mapStringArrayToObject = <T>(
  array: string[],
  v: T,
): { [key: string]: T } => {
  if (!Array.isArray(array)) {
    return {};
  }
  return array.reduce((prev, curr) => {
    let value = v;
    if (typeof v === "function") {
      value = v(curr);
    }
    return { ...prev, [curr]: value };
  }, {});
};

/**
 * `toArray` takes a value and converts it into an array if it is not already
 * @param value - The value to convert to an array
 * @returns The array created from the value
 */
export const toArray = <T>(value: T | T[]): T[] => {
  if (Array.isArray(value)) {
    return value;
  }
  return value === undefined || value === null ? [] : [value];
};

/**
 * `arrayIntersection` takes in two arrays and returns the intersecting elements of the two arrays
 * @param a - The first array
 * @param b - The second array
 * @returns The intersecting elements of the two arrays
 * @example arrayIntersection([1, 2, 3], [2, 3, 4]) // [2, 3]
 */
export const arrayIntersection = <T>(a: T[], b: T[]) => {
  if (typeof a[0] === "object" || typeof b[0] === "object") {
    throw new TypeError("arrayIntersection does not support objects");
  }
  const setA = new Set(a);
  const setB = new Set(b);
  const intersection = Array.from(setA).filter((x) => setB.has(x));
  return intersection;
};

type SortFunction<T> = (a: T, b: T) => number;

/**
 * `arrayUnion` takes in two arrays and returns the union of the two arrays it also takes in an optional sort function
 * @param a - The first array
 * @param b - The second array
 * @param sort - An optional sort function to sort the union
 * @returns The union of the two arrays
 * @example arrayUnion([1, 2, 3], [2, 3, 4]) // [1, 2, 3, 4]
 * @example arrayUnion([1, 2, 3], [2, 3, 4], (a, b) => b - a) // [4, 3, 2, 1]
 */
export const arrayUnion = <T>(a: T[], b: T[], sort?: SortFunction<T>) => {
  if (typeof a[0] === "object" || typeof b[0] === "object") {
    throw new TypeError("arrayUnion does not support objects");
  }

  const union = Array.from(new Set([...a, ...b]));
  if (sort) {
    return union.sort(sort);
  }
  return union;
};

/**
 * `range` works like the Python range function. Returns an array that starts at the START value,
 * incrementing by the STEP value, and stopping once the STOP value has been reached or surpassed.
 * START & STOP are inclusive.
 * @param start - The starting value
 * @param stop - The stopping value
 * @param step - The incrementing value
 * @returns The array of numbers
 * @example range(0, 10, 2) = [0, 2, 4, 6, 8, 10]
 * Taken from official docs:
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/from#sequence_generator_range
 */
export const range = (start: number, stop: number, step?: number): number[] => {
  const stepValue = step ?? 1;
  const arrLength = (stop - start) / stepValue + 1;
  return Array.from({ length: arrLength }, (_, i) => start + i * stepValue);
};
