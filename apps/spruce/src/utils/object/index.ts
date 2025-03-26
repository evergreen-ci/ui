import { JSONValue } from "./types";

/**
 * `omit` is a utility function that removes the supplied key(s) from an object.
 * @param obj - The object to process.
 * @param params - The keys to omit.
 * @returns - A new object without the supplied key(s).
 * @example omit({ a: 1, b: 1, c: 1 }, ["b", "c"]) => { a: 1 }
 */
export const omit = <T extends object, K extends [...(keyof T)[]]>(
  obj: T,
  params: K,
) => {
  const newObj = { ...obj };
  params.forEach((param) => delete newObj[param]);
  return newObj as Omit<T, K[number]>;
};

/** Convert a dot-separated path string into a tuple type */
type StringToPath<S extends string> = S extends `${infer Head}.${infer Rest}`
  ? [Head, ...StringToPath<Rest>]
  : [S];

/** Recursively walk the object and extract the type at the path */
type PathValue<T, P extends readonly string[]> = P extends [
  infer Head,
  ...infer Tail,
]
  ? Head extends keyof T
    ? Tail extends string[]
      ? PathValue<T[Head], Tail>
      : T[Head]
    : T extends readonly any[]
      ? Head extends `${number}`
        ? Tail extends string[]
          ? PathValue<T[number], Tail>
          : T[number]
        : undefined
      : JSONValue
  : T;

/**
 * `getObjectValueByPath` takes an object and a dot notation path and returns the value at that path.
 * @param obj - The object to process.
 * @param path - The dot notation path.
 * @returns - The value at the path.
 * @example getObjectValueByPath({ a: { b: { c: 1 } } }, "a.b.c") => 1
 * @example getObjectValueByPath({ a: { b: { c: 1 } } }, "a.b") => { c: 1 }
 */
export const getObjectValueByPath = <T extends JSONValue, P extends string>(
  obj: T,
  path: P,
): PathValue<T, StringToPath<P>> => {
  const keys = path.split(".");

  return keys.reduce<any>((acc, key) => {
    if (Array.isArray(acc)) {
      const index = Number(key);
      return Number.isInteger(index) ? acc[index] : undefined;
    }

    if (acc && typeof acc === "object") {
      return acc[key as keyof typeof acc];
    }

    return undefined;
  }, obj);
};

type WithoutTypename<T> =
  T extends Record<string, unknown>
    ? {
        [K in keyof T as K extends "__typename" ? never : K]: WithoutTypename<
          T[K]
        >;
      }
    : T;

/**
 * `omitTypename` removes the __typename property from an object
 * @param object - the object to remove the __typename property from
 * @returns - the object without the __typename property
 * @example
 * omitTypename({ __typename: "Task", id: "123" }) // { id: "123" }
 */
export const omitTypename = <T>(object: T): WithoutTypename<T> =>
  JSON.parse(JSON.stringify(object), (key, value) =>
    key === "__typename" ? undefined : value,
  );

/**
 * `isObject` is a type guard that checks if a value is an object and not an array.
 * @param val - The value to check.
 * @returns - A boolean indicating if the value is an object.
 * @example isObject({}) => true
 * @example isObject([]) => false
 * @example isObject(null) => false
 */
export const isObject = (val: unknown): val is Record<string, unknown> =>
  val !== null && typeof val === "object" && !Array.isArray(val);
