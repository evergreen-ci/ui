const getLocalStorageString = (key: string): string | undefined => {
  try {
    return localStorage.getItem(key) ?? undefined;
  } catch {
    return undefined;
  }
};

const setLocalStorageString = (key: string, value: string): void => {
  try {
    localStorage.setItem(key, value);
  } catch {
    // Silently fail if localStorage is unavailable or full.
  }
};

/**
 * Reads a boolean from localStorage, returning defaultValue (or undefined) if the key is absent.
 * @param key - The localStorage key.
 * @param defaultValue - Value returned when the key is absent.
 * @returns The stored boolean, the defaultValue, or undefined.
 */
const getLocalStorageBoolean = (
  key: string,
  defaultValue?: boolean,
): boolean | undefined => {
  const value = getLocalStorageString(key);
  if (value === undefined) return defaultValue;
  return value === "true";
};

const setLocalStorageBoolean = (key: string, value: boolean): void => {
  setLocalStorageString(key, value.toString());
};

export {
  getLocalStorageBoolean,
  getLocalStorageString,
  setLocalStorageBoolean,
  setLocalStorageString,
};
