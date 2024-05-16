import { DistroSettingsTabRoutes } from "constants/routes";
import * as general from "./GeneralTab/transformers";
import * as host from "./HostTab/transformers";
import * as project from "./ProjectTab/transformers";
import * as provider from "./ProviderTab/transformers";
import * as task from "./TaskTab/transformers";
import {
  FormToGqlFunction,
  GqlToFormFunction,
  WritableDistroSettingsType,
} from "./types";

export const formToGqlMap: {
  [T in WritableDistroSettingsType]: FormToGqlFunction<T>;
} = {
  // @ts-ignore: FIXME. This comment was added by an automated script.
  [DistroSettingsTabRoutes.General]: general.formToGql,
  // @ts-ignore: FIXME. This comment was added by an automated script.
  [DistroSettingsTabRoutes.Host]: host.formToGql,
  // @ts-ignore: FIXME. This comment was added by an automated script.
  [DistroSettingsTabRoutes.Project]: project.formToGql,
  // @ts-ignore: FIXME. This comment was added by an automated script.
  [DistroSettingsTabRoutes.Provider]: provider.formToGql,
  // @ts-ignore: FIXME. This comment was added by an automated script.
  [DistroSettingsTabRoutes.Task]: task.formToGql,
};

export const gqlToFormMap: {
  [T in WritableDistroSettingsType]?: GqlToFormFunction<T>;
} = {
  // @ts-ignore: FIXME. This comment was added by an automated script.
  [DistroSettingsTabRoutes.General]: general.gqlToForm,
  // @ts-ignore: FIXME. This comment was added by an automated script.
  [DistroSettingsTabRoutes.Host]: host.gqlToForm,
  // @ts-ignore: FIXME. This comment was added by an automated script.
  [DistroSettingsTabRoutes.Project]: project.gqlToForm,
  // @ts-ignore: FIXME. This comment was added by an automated script.
  [DistroSettingsTabRoutes.Provider]: provider.gqlToForm,
  // @ts-ignore: FIXME. This comment was added by an automated script.
  [DistroSettingsTabRoutes.Task]: task.gqlToForm,
};
