import { reportError } from "@evg-ui/lib/utils/errorReporting";

type LocalStorageObject = Record<string, any>;

export const getObject = <T extends LocalStorageObject>(
  key: string,
): T | LocalStorageObject => {
  const obj = localStorage.getItem(key);
  try {
    if (obj) {
      // If JSON.parse type assertion fails, it returns null
      return (JSON.parse(obj) as T) ?? {};
    }
    return {};
  } catch (e) {
    reportError(
      new Error(`Getting object '${key}' from localStorage`, { cause: e }),
    ).warning();
    return {};
  }
};

export const setObject = (key: string, obj: LocalStorageObject) => {
  localStorage.setItem(key, JSON.stringify(obj));
};
