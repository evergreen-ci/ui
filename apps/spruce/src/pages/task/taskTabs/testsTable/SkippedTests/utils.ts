import { TaskQuarantinedTestsSampleQuery } from "gql/generated/types";

export type SkippedTestsSample = NonNullable<
  TaskQuarantinedTestsSampleQuery["version"]["taskQuarantinedTestsSample"]
>[number];

// Matches the backend's default sample size; the modal points to the JSON
// download for anything beyond it.
export const MODAL_DISPLAY_LIMIT = 50;

// The backend caps stored entries well below this, so fetching with this
// limit returns the entire stored list.
export const FULL_LIST_LIMIT = 100000;

export const buildSkippedTestsJson = (sample: SkippedTestsSample) => ({
  taskId: sample.taskId,
  execution: sample.execution,
  skippedTestCount: sample.quarantinedTestsSkippedCount,
  truncated:
    sample.quarantinedTests.length < sample.quarantinedTestsSkippedCount,
  skippedTests: sample.quarantinedTests.map(
    ({ displayTestName, testName }) => ({
      testName,
      ...(displayTestName && { displayTestName }),
    }),
  ),
});
