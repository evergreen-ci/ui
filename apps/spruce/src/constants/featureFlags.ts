/* eslint-disable */
import { isEndUserProduction } from "utils/environmentVariables";
import { getLocalStorageString } from "@evg-ui/lib/utils/localStorage";

const TABLE_MODE_KEY = "table-mode"

export enum TableMode {
  Inline = "inline",
  NewColumn = "new-column",
}

export const getTableMode = (): TableMode | null => {
  if (isEndUserProduction()) {
    return null;
  }

  return getLocalStorageString(TABLE_MODE_KEY) as TableMode ?? TableMode.Inline;
}
