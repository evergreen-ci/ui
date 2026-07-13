import { TaskQuarantinedTestsSampleQuery } from "gql/generated/types";

export type QuarantinedTestsSample = NonNullable<
  TaskQuarantinedTestsSampleQuery["version"]["taskQuarantinedTestsSample"]
>[number];

// Matches the backend's default sample size; the modal points to the JSON
// download for anything beyond it.
export const MODAL_DISPLAY_LIMIT = 50;

// The backend caps stored entries well below this, so fetching with this
// limit returns the entire stored list.
export const FULL_LIST_LIMIT = 100000;

export const buildQuarantinedTestsJson = (sample: QuarantinedTestsSample) => ({
  taskId: sample.taskId,
  execution: sample.execution,
  quarantinedTestsSkippedCount: sample.quarantinedTestsSkippedCount,
  truncated:
    sample.quarantinedTests.length < sample.quarantinedTestsSkippedCount,
  quarantinedTests: sample.quarantinedTests.map(
    ({ displayTestName, testName }) => ({
      testName,
      ...(displayTestName && { displayTestName }),
    }),
  ),
});

export const downloadJsonBlob = (payload: object, filename: string) => {
  const element = document.createElement("a");
  const file = new Blob([JSON.stringify(payload, null, 2)], {
    type: "application/json",
  });
  element.href = URL.createObjectURL(file);
  element.download = filename;
  document.body.appendChild(element);
  element.click();
  URL.revokeObjectURL(element.href);
  document.body.removeChild(element);
};
