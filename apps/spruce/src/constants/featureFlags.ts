import {
  getLocalStorageString,
  setLocalStorageString,
} from "@evg-ui/lib/utils/localStorage";
import { isEndUserProduction } from "utils/environmentVariables";

const TABLE_MODE_KEY = "table-mode";

export type TableMode = "inline" | "new-column" | "default";

export const getTableMode = (): TableMode => {
  if (isEndUserProduction()) {
    return "default";
  }

  return (getLocalStorageString(TABLE_MODE_KEY) as TableMode) ?? "default";
};

export const setTableMode = (mode: TableMode) => {
  setLocalStorageString(TABLE_MODE_KEY, mode);
};
