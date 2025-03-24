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
