import { LastMainlineCommitQuery } from "gql/generated/types";
import { reportError } from "utils/errorReporting";

// The return value from GetLastMainlineCommitQuery has a lot of nested fields that may or may
// not exist. The logic to extract the task from it is written in this function.
export const getTaskFromMainlineCommitsQuery = (
  data: LastMainlineCommitQuery,
): CommitTask => {
  const buildVariants =
    // @ts-expect-error: FIXME. This comment was added by an automated script.
    data?.mainlineCommits.versions.find(({ version }) => version)?.version
      .buildVariants ?? [];
  if (buildVariants.length > 1) {
    reportError(
      new Error("Multiple build variants matched previous commit search."),
    ).warning();
  }
  // @ts-expect-error: FIXME. This comment was added by an automated script.
  if (buildVariants[0]?.tasks.length > 1) {
    reportError(
      new Error("Multiple tasks matched previous commit search."),
    ).warning();
  }
  // @ts-expect-error: FIXME. This comment was added by an automated script.
  return buildVariants[0]?.tasks[0];
};

export type CommitTask =
  // @ts-expect-error: FIXME. This comment was added by an automated script.
  LastMainlineCommitQuery["mainlineCommits"]["versions"][number]["version"]["buildVariants"][number]["tasks"][number];
