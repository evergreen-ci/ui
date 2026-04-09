import { ProjectSettingsTabRoutes } from "constants/routes";
import { FormToGqlFunction, GqlToFormFunction } from "../types";

type Tab = ProjectSettingsTabRoutes.Variables;

type VarsAccumulator = {
  vars: { [key: string]: string };
  privateVarsList: string[];
  adminOnlyVarsList: string[];
  varsDescriptions: { [key: string]: string };
};

export const gqlToForm = ((data) => {
  if (!data) return null;

  const {
    // @ts-expect-error: FIXME. This comment was added by an automated script.
    vars: { adminOnlyVars, privateVars, vars, varsDescriptions },
  } = data;

  return {
    vars: Object.entries(vars).map(([varName, varValue]) => ({
      varName,
      varValue: varValue || "{REDACTED}",
      varDescription: varsDescriptions[varName] ?? "",
      isPrivate: privateVars.includes(varName),
      isAdminOnly: adminOnlyVars.includes(varName),
      isDisabled: privateVars.includes(varName),
    })),
  };
  // @ts-expect-error: FIXME. This comment was added by an automated script.
}) satisfies GqlToFormFunction<Tab>;

export const formToGql = (({ vars: varsData }, isRepo, id) => {
  const initialValue: VarsAccumulator = {
    vars: {},
    privateVarsList: [],
    adminOnlyVarsList: [],
    varsDescriptions: {},
  };

  const vars = varsData.reduce(
    (
      acc,
      { isAdminOnly, isDisabled, isPrivate, varDescription, varName, varValue },
    ) => {
      if (!varName || !varValue) return acc;

      let val = varValue;
      if (isPrivate) {
        acc.privateVarsList.push(varName);
        // Overwrite {REDACTED} for variables that have been previously saved as private variables.
        if (isDisabled) val = "";
      }
      if (isAdminOnly) {
        acc.adminOnlyVarsList.push(varName);
      }
      if (varDescription) {
        acc.varsDescriptions[varName] = varDescription;
      }
      acc.vars[varName] = val;
      return acc;
    },
    initialValue,
  );
  return {
    ...(isRepo ? { repoId: id } : { projectId: id }),
    projectRef: { id },
    vars,
  };
}) satisfies FormToGqlFunction<Tab>;
