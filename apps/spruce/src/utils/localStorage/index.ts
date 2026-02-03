import { reportError } from "@evg-ui/lib/utils";

type LocalStorageObject = Record<string, any>;

export const getObject = (key: string): LocalStorageObject => {
  const obj = localStorage.getItem(key);
  try {
    return obj ? JSON.parse(obj) : {};
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
