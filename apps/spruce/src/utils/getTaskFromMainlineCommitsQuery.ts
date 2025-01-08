import { Unpacked } from "@evg-ui/lib/types/utils";
import { LastMainlineCommitQuery } from "gql/generated/types";
import { reportError } from "utils/errorReporting";

// The return value from GetLastMainlineCommitQuery has a lot of nested fields that may or may
// not exist. The logic to extract the task from it is written in this function.
export const getTaskFromMainlineCommitsQuery = (
  data: LastMainlineCommitQuery,
): CommitTask | undefined => {
  console.log({ data });
  const { mainlineCommits } = data ?? {};
  if (mainlineCommits === null || mainlineCommits === undefined) {
    reportError(new Error("mainlineCommits is undefined")).warning();
    return;
  }
  const mainlineCommitVersions = mainlineCommits.versions;
  if (mainlineCommitVersions === null || mainlineCommitVersions === undefined) {
    reportError(new Error("mainlineCommits.versions is undefined")).warning();
    return;
  }
  const buildVariants =
    mainlineCommitVersions.find(({ version }) => version)?.version
      ?.buildVariants ?? [];
  if (buildVariants.length > 1) {
    reportError(
      new Error("Multiple build variants matched previous commit search."),
    ).warning();
    return;
  }
  const buildVariant = buildVariants[0];
  if (buildVariant === null || buildVariant === undefined) {
    reportError(new Error("buildVariant is undefined")).warning();
    return;
  }
  if (!buildVariant.tasks) {
    reportError(new Error("buildVariant.tasks is undefined")).warning();
    return;
  }
  if (buildVariant.tasks.length > 1) {
    reportError(
      new Error("Multiple tasks matched previous commit search."),
    ).warning();
    return;
  }
  return buildVariant.tasks[0];
};

export type CommitTask = Unpacked<
  NonNullable<LastMainlineCommitQueryVersionBuildVariants[number]["tasks"]>
>;

type LastMainlineCommitQueryVersion = Unpacked<
  NonNullable<LastMainlineCommitQuery["mainlineCommits"]>["versions"]
>["version"];

type LastMainlineCommitQueryVersionBuildVariants = NonNullable<
  NonNullable<LastMainlineCommitQueryVersion>["buildVariants"]
>;
