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

const getLocalStorageBoolean = (
  key: string,
  defaultValue: boolean,
): boolean => {
  const value = getLocalStorageString(key);
  if (value === null) return defaultValue;
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
