const getString = (key: string): string | null => {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
};

const setString = (key: string, value: string): void => {
  try {
    localStorage.setItem(key, value);
  } catch {
    // Silently fail if localStorage is unavailable or full.
  }
};

const getBoolean = (key: string, defaultValue: boolean): boolean => {
  const value = getString(key);
  if (value === null) return defaultValue;
  return value === "true";
};

const setBoolean = (key: string, value: boolean): void => {
  setString(key, value.toString());
};

export { getBoolean, getString, setBoolean, setString };
