import { AdminSettingsTabRoutes } from "constants/routes";
import * as general from "./GeneralTab/transformers";
import {
  FormToGqlFunction,
  GqlToFormFunction,
  WritableAdminSettingsType,
} from "./types";

export const formToGqlMap: {
  [T in WritableAdminSettingsType]: FormToGqlFunction<T>;
} = {
  // @ts-expect-error: FIXME. This comment was added by an automated script.
  [AdminSettingsTabRoutes.General]: general.formToGql,
};
export const gqlToFormMap: {
  [T in WritableAdminSettingsType]?: GqlToFormFunction<T>;
} = {
  // @ts-expect-error: FIXME. This comment was added by an automated script.
  [AdminSettingsTabRoutes.General]: general.gqlToForm,
};
