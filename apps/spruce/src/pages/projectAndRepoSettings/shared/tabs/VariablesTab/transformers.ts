import { ProjectSettingsTabRoutes } from "constants/routes";
import { FormToGqlFunction, GqlToFormFunction } from "../types";

type Tab = ProjectSettingsTabRoutes.Variables;

export const gqlToForm = ((data) => {
  if (!data) return null;

  const {
    // @ts-expect-error: FIXME. This comment was added by an automated script.
    vars: { adminOnlyVars, privateVars, vars },
  } = data;

  return {
    vars: Object.entries(vars).map(([varName, varValue]) => ({
      varName,
      varValue: varValue || "{REDACTED}",
      isPrivate: privateVars.includes(varName),
      isAdminOnly: adminOnlyVars.includes(varName),
      isDisabled: privateVars.includes(varName),
    })),
  };
  // @ts-expect-error: FIXME. This comment was added by an automated script.
}) satisfies GqlToFormFunction<Tab>;

export const formToGql = (({ vars: varsData }, isRepo, id) => {
  const vars = varsData.reduce(
    (acc, { isAdminOnly, isDisabled, isPrivate, varName, varValue }) => {
      if (!varName || !varValue) return acc;

      let val = varValue;
      if (isPrivate) {
        // @ts-expect-error: FIXME. This comment was added by an automated script.
        acc.privateVarsList.push(varName);
        // Overwrite {REDACTED} for variables that have been previously saved as private variables
        if (isDisabled) val = "";
      }
      if (isAdminOnly) {
        // @ts-expect-error: FIXME. This comment was added by an automated script.
        acc.adminOnlyVarsList.push(varName);
      }
      // @ts-expect-error: FIXME. This comment was added by an automated script.
      acc.vars[varName] = val;
      return acc;
    },
    {
      vars: {},
      privateVarsList: [],
      adminOnlyVarsList: [],
    },
  );
  return {
    ...(isRepo ? { repoId: id } : { projectId: id }),
    projectRef: { id },
    vars,
  };
  // @ts-expect-error: FIXME. This comment was added by an automated script.
}) satisfies FormToGqlFunction<Tab>;
