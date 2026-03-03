const getLocalStorageString = (key: string): string | null => {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
};

const setLocalStorageString = (key: string, value: string): void => {
  try {
    localStorage.setItem(key, value);
  } catch {
    // Silently fail if localStorage is unavailable or full.
  }
};

function getLocalStorageBoolean(key: string): boolean | undefined;
function getLocalStorageBoolean(key: string, defaultValue: boolean): boolean;
/**
 * Reads a boolean from localStorage, returning defaultValue (or undefined) if the key is absent.
 * @param key - The localStorage key.
 * @param defaultValue - Value returned when the key is absent.
 * @returns The stored boolean, the defaultValue, or undefined.
 */
function getLocalStorageBoolean(
  key: string,
  defaultValue?: boolean,
): boolean | undefined {
  const value = getLocalStorageString(key);
  if (value === null) return defaultValue;
  return value === "true";
}

const setLocalStorageBoolean = (key: string, value: boolean): void => {
  setLocalStorageString(key, value.toString());
};

export {
  getLocalStorageBoolean,
  getLocalStorageString,
  setLocalStorageBoolean,
  setLocalStorageString,
};
