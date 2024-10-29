type LocalStorageObject = Record<string, any>;

export const getObject = (key: string): LocalStorageObject => {
  const obj = localStorage.getItem(key);
  try {
    return obj ? JSON.parse(obj) : {};
  } catch {
    return {};
  }
};

export const setObject = (key: string, obj: LocalStorageObject) => {
  localStorage.setItem(key, JSON.stringify(obj));
};
