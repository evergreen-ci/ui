import { ProjectSettingsTabRoutes } from "constants/routes";
import { FormToGqlFunction, GqlToFormFunction } from "../types";
import { ProjectType, alias as aliasUtils } from "../utils";
import { TaskSpecifier } from "./types";

const { sortAliases, transformAliases } = aliasUtils;

type Tab = ProjectSettingsTabRoutes.PatchAliases;

// @ts-expect-error: FIXME. This comment was added by an automated script.
export const gqlToForm: GqlToFormFunction<Tab> = ((data, options) => {
  if (!data) return null;

  const { aliases, projectRef } = data;
  const {
    githubMQTriggerAliases,
    githubPRTriggerAliases,
    patchTriggerAliases,
  } = projectRef ?? {};

  // @ts-expect-error: FIXME. This comment was added by an automated script.
  const { projectType } = options;
  const isAttachedProject = projectType === ProjectType.AttachedProject;

  // @ts-expect-error: FIXME. This comment was added by an automated script.
  const { patchAliases } = sortAliases(aliases);

  return {
    patchAliases: {
      aliases: patchAliases.map((a) => ({
        ...a,
        displayTitle: a.alias,
      })),
      aliasesOverride: !isAttachedProject || !!patchAliases.length,
    },
    patchTriggerAliases: {
      aliases:
        patchTriggerAliases?.map((p) => ({
          ...p,
          displayTitle: p.alias,
          downstreamRevision: p.downstreamRevision ?? "",
          isGithubMQTriggerAlias: githubMQTriggerAliases?.includes(p.alias),
          isGithubPRTriggerAlias: githubPRTriggerAliases?.includes(p.alias),
          parentAsModule: p.parentAsModule ?? "",
          status: p.status,
          taskSpecifiers:
            p.taskSpecifiers?.map((t) => ({
              ...t,
              specifier: t.patchAlias
                ? TaskSpecifier.PatchAlias
                : TaskSpecifier.VariantTask,
            })) ?? [],
        })) ?? [],
      aliasesOverride: !isAttachedProject || !!patchTriggerAliases,
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

  const githubMQTriggerAliases: string[] = [];
  const githubPRTriggerAliases: string[] = [];
  const patchTriggerAliases = ptaData.aliasesOverride
    ? ptaData.aliases.map((a) => {
        if (a.isGithubMQTriggerAlias) {
          githubMQTriggerAliases.push(a.alias);
        }
        if (a.isGithubPRTriggerAlias) {
          githubPRTriggerAliases.push(a.alias);
        }
        return {
          alias: a.alias,
          childProjectIdentifier: a.childProjectIdentifier,
          downstreamRevision: a.downstreamRevision,
          parentAsModule: a.parentAsModule,
          status: a.status,
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
        };
      })
    : null;

  return {
    ...(isRepo ? { repoId: id } : { projectId: id }),
    aliases,
    projectRef: {
      githubMQTriggerAliases,
      githubPRTriggerAliases,
      id,
      patchTriggerAliases,
    },
  };
}) satisfies FormToGqlFunction<Tab>;
