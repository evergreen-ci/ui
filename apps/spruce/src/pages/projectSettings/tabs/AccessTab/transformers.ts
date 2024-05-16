import { ProjectSettingsTabRoutes } from "constants/routes";
import { ProjectInput } from "gql/generated/types";
import { FormToGqlFunction, GqlToFormFunction } from "../types";

type Tab = ProjectSettingsTabRoutes.Access;

export const gqlToForm = ((data) => {
  if (!data) return null;

  const { projectRef } = data;
  return {
    accessSettings: {
      // @ts-ignore: FIXME. This comment was added by an automated script.
      restricted: projectRef.restricted,
    },
    admin: {
      // @ts-ignore: FIXME. This comment was added by an automated script.
      admins: projectRef.admins ?? [],
    },
  };
  // @ts-ignore: FIXME. This comment was added by an automated script.
}) satisfies GqlToFormFunction<Tab>;

export const formToGql = (({ accessSettings, admin }, isRepo, id) => {
  const projectRef: ProjectInput = {
    // @ts-ignore: FIXME. This comment was added by an automated script.
    id,
    restricted: accessSettings.restricted,
    admins: admin.admins,
  };

  return { ...(isRepo ? { repoId: id } : { projectId: id }), projectRef };
  // @ts-ignore: FIXME. This comment was added by an automated script.
}) satisfies FormToGqlFunction<Tab>;
