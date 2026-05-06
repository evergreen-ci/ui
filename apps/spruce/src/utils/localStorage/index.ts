import { reportError } from "@evg-ui/lib/utils/errorReporting";

type LocalStorageObject = Record<string, unknown>;

export const getObject = <T extends LocalStorageObject = LocalStorageObject>(
  key: string,
): T => {
  const obj = localStorage.getItem(key);
  try {
    return obj ? JSON.parse(obj) : ({} as T);
  } catch (e) {
    reportError(
      new Error(`Getting object '${key}' from localStorage`, { cause: e }),
    ).warning();
    return {} as T;
  }
};

export const setObject = (key: string, obj: LocalStorageObject) => {
  localStorage.setItem(key, JSON.stringify(obj));
};
