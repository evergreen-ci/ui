import { ProjectSettingsTabRoutes } from "constants/routes";
import { ProjectInput, type PatchTriggerAlias } from "gql/generated/types";
import { FormToGqlFunction, GqlToFormFunction } from "../types";
import { alias as aliasUtils, ProjectType } from "../utils";
import { MergeQueueFormState } from "./types";

const { AliasNames, sortAliases, transformAliases } = aliasUtils;

type Tab = ProjectSettingsTabRoutes.GithubCommitQueue;

export const mergeProjectRepo = (
  projectData: MergeQueueFormState,
  repoData: MergeQueueFormState,
): MergeQueueFormState => {
  // Merge project and repo objects so that repo config can be displayed on project pages
  const {
    mergeQueue: { patchDefinitions },
  } = repoData;
  const mergedObject: MergeQueueFormState = projectData;
  mergedObject.mergeQueue.patchDefinitions.repoData = patchDefinitions;
  return mergedObject;
};

export const gqlToForm = ((data, options) => {
  if (!data) return null;

  const { aliases, projectRef } = data;
  const { projectType } = options ?? {};

  const { commitQueue } = projectRef ?? {};

  const { mergeQueueAliases } = sortAliases(aliases ?? []);

  const override = (field: Array<unknown>) =>
    projectType !== ProjectType.AttachedProject || !!field?.length;

  const githubMQTriggerAliases =
    projectRef?.githubMQTriggerAliases
      ?.map((aliasName) =>
        projectRef?.patchTriggerAliases?.find(
          ({ alias }) => alias === aliasName,
        ),
      )
      .filter((a): a is PatchTriggerAlias => !!a) ?? [];

  return {
    mergeQueue: {
      enabled: commitQueue?.enabled ?? false,
      patchDefinitions: {
        mergeQueueAliasesOverride: override(mergeQueueAliases),
        mergeQueueAliases,
      },
      githubMQTriggerAliases,
    },
  };
  // @ts-expect-error: FIXME. This comment was added by an automated script.
}) satisfies GqlToFormFunction<Tab>;

export const formToGql = ((
  { mergeQueue: { enabled, patchDefinitions } }: MergeQueueFormState,
  isRepo,
  id,
) => {
  const projectRef: ProjectInput = {
    id: id ?? "",
    commitQueue: {
      enabled,
    },
  };

  const mergeQueueAliases = transformAliases(
    patchDefinitions.mergeQueueAliases,
    patchDefinitions.mergeQueueAliasesOverride,
    AliasNames.MergeQueue,
  );

  const aliases = [...mergeQueueAliases];

  return {
    ...(isRepo ? { repoId: id } : { projectId: id }),
    projectRef,
    aliases,
  };
}) satisfies FormToGqlFunction<Tab>;
