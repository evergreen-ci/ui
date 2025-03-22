import { Unpacked } from "@evg-ui/lib/types/utils";
import { reportError } from "@evg-ui/lib/utils/errorReporting";
import { LastMainlineCommitQuery } from "gql/generated/types";

// The return value from GetLastMainlineCommitQuery has a lot of nested fields that may or may
// not exist. The logic to extract the task from it is written in this function.
export const getTaskFromMainlineCommitsQuery = (
  data: NonNullable<LastMainlineCommitQuery>,
): CommitTask | undefined => {
  const mainlineCommitVersions = data.mainlineCommits?.versions;
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
    return;
  }
  if (!buildVariant.tasks) {
    return;
  }
  if (buildVariant.tasks.length > 1) {
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
