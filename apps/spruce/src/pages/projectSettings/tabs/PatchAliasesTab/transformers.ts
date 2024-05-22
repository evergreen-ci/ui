import { ProjectSettingsTabRoutes } from "constants/routes";
import { PatchStatus } from "types/patch";
import { FormToGqlFunction, GqlToFormFunction } from "../types";
import { alias as aliasUtils, ProjectType } from "../utils";
import { TaskSpecifier } from "./types";

const { sortAliases, transformAliases } = aliasUtils;

type Tab = ProjectSettingsTabRoutes.PatchAliases;

// Ensure that the front end can ingest patch trigger alias status filters that use either "success" or "succeeded" and convert them to "success".
// TODO EVG-20032: Remove conversion.
const migrateSuccessStatus = (status: string) => {
  if (status === PatchStatus.LegacySucceeded) {
    return PatchStatus.Success;
  }
  return status ?? "";
};

// @ts-expect-error: FIXME. This comment was added by an automated script.
export const gqlToForm: GqlToFormFunction<Tab> = ((data, options) => {
  if (!data) return null;

  const {
    aliases,
    // @ts-expect-error: FIXME. This comment was added by an automated script.
    projectRef: { githubTriggerAliases, patchTriggerAliases },
  } = data;
  // @ts-expect-error: FIXME. This comment was added by an automated script.
  const { projectType } = options;
  const isAttachedProject = projectType === ProjectType.AttachedProject;

  // @ts-expect-error: FIXME. This comment was added by an automated script.
  const { patchAliases } = sortAliases(aliases);

  return {
    patchAliases: {
      aliasesOverride: !isAttachedProject || !!patchAliases.length,
      aliases: patchAliases.map((a) => ({
        ...a,
        displayTitle: a.alias,
      })),
    },
    patchTriggerAliases: {
      aliasesOverride: !isAttachedProject || !!patchTriggerAliases,
      aliases:
        // @ts-expect-error: FIXME. This comment was added by an automated script.
        patchTriggerAliases?.map((p) => ({
          ...p,
          taskSpecifiers:
            // @ts-expect-error: FIXME. This comment was added by an automated script.
            p.taskSpecifiers?.map((t) => ({
              ...t,
              specifier: t.patchAlias
                ? TaskSpecifier.PatchAlias
                : TaskSpecifier.VariantTask,
            })) ?? [],
          status: migrateSuccessStatus(p.status),
          parentAsModule: p.parentAsModule ?? "",
          isGithubTriggerAlias: githubTriggerAliases?.includes(p.alias),
          displayTitle: p.alias,
        })) ?? [],
    },
  };
  // @ts-expect-error: FIXME. This comment was added by an automated script.
}) satisfies GqlToFormFunction<Tab>;

export const formToGql = ((
  { patchAliases, patchTriggerAliases: ptaData },
  isRepo,
  id,
) => {
  const aliases = transformAliases(
    patchAliases.aliases,
    patchAliases.aliasesOverride,
  );

  // @ts-expect-error: FIXME. This comment was added by an automated script.
  const githubTriggerAliases = [];
  const patchTriggerAliases = ptaData.aliasesOverride
    ? ptaData.aliases.map((a) => {
        if (a.isGithubTriggerAlias) {
          githubTriggerAliases.push(a.alias);
        }
        return {
          alias: a.alias,
          childProjectIdentifier: a.childProjectIdentifier,
          taskSpecifiers:
            a.taskSpecifiers?.map(
              ({ patchAlias, specifier, taskRegex, variantRegex }) =>
                specifier === TaskSpecifier.PatchAlias
                  ? {
                      patchAlias,
                      taskRegex: "",
                      variantRegex: "",
                    }
                  : {
                      patchAlias: "",
                      taskRegex,
                      variantRegex,
                    },
            ) ?? [],
          status: a.status,
          parentAsModule: a.parentAsModule,
        };
      })
    : null;

  return {
    ...(isRepo ? { repoId: id } : { projectId: id }),
    // @ts-expect-error: FIXME. This comment was added by an automated script.
    projectRef: { id, patchTriggerAliases, githubTriggerAliases },
    aliases,
  };
  // @ts-expect-error: FIXME. This comment was added by an automated script.
}) satisfies FormToGqlFunction<Tab>;
