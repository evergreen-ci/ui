import { ProjectSettingsTabRoutes } from "constants/routes";
import { FormToGqlFunction, GqlToFormFunction } from "../types";
import { alias as aliasUtils, ProjectType } from "../utils";
import { TaskSpecifier } from "./types";

const { sortAliases, transformAliases } = aliasUtils;

type Tab = ProjectSettingsTabRoutes.PatchAliases;

// @ts-expect-error: FIXME. This comment was added by an automated script.
export const gqlToForm: GqlToFormFunction<Tab> = ((data, options) => {
  if (!data) return null;

  const {
    aliases,
    // @ts-expect-error: FIXME. This comment was added by an automated script.
    projectRef: { githubPRTriggerAliases, patchTriggerAliases },
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
          status: p.status,
          parentAsModule: p.parentAsModule ?? "",
          downstreamRevision: p.downstreamRevision ?? "",
          isGithubTriggerAlias: githubPRTriggerAliases?.includes(p.alias),
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
  const githubPRTriggerAliases = [];
  const patchTriggerAliases = ptaData.aliasesOverride
    ? ptaData.aliases.map((a) => {
        if (a.isGithubTriggerAlias) {
          githubPRTriggerAliases.push(a.alias);
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
          downstreamRevision: a.downstreamRevision,
        };
      })
    : null;

  return {
    ...(isRepo ? { repoId: id } : { projectId: id }),
    projectRef: {
      id,
      patchTriggerAliases,
      // @ts-expect-error: FIXME. This comment was added by an automated script.
      githubPRTriggerAliases,
    },
    aliases,
  };
  // @ts-expect-error: FIXME. This comment was added by an automated script.
}) satisfies FormToGqlFunction<Tab>;
