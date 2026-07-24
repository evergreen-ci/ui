import { useEffect, useState } from "react";
import { skipToken, useLazyQuery, useQuery } from "@apollo/client/react";
import pluralize from "pluralize";
import { WordBreak } from "@evg-ui/lib/components/styles";
import { LGColumnDef } from "@evg-ui/lib/components/Table";
import { useToastContext } from "@evg-ui/lib/context/toast";
import { useQueryParams } from "@evg-ui/lib/hooks";
import { downloadObjectAsJson } from "@evg-ui/lib/utils/request";
import { useTaskAnalytics } from "analytics";
import { SkippedTestsModal } from "components/SkippedTestsModal";
import {
  TaskQuarantinedTestsSampleQuery,
  TaskQuarantinedTestsSampleQueryVariables,
  TaskQuery,
} from "gql/generated/types";
import { TASK_QUARANTINED_TESTS_SAMPLE } from "gql/queries";
import { QueryParams } from "types/task";
import { formatZeroIndexForDisplay } from "utils/numbers";
import {
  FULL_LIST_LIMIT,
  MODAL_DISPLAY_LIMIT,
  SkippedTestsSample,
  buildSkippedTestsJson,
} from "./utils";

type SkippedTestEntry = SkippedTestsSample["quarantinedTests"][number];

interface SkippedTestsProps {
  task: NonNullable<TaskQuery["task"]>;
}

export const SkippedTests: React.FC<SkippedTestsProps> = ({ task }) => {
  const { execution, id: taskId, quarantinedTestsSkippedCount: count } = task;
  const versionId = task.versionMetadata.id;
  const dispatchToast = useToastContext();
  const { sendEvent } = useTaskAnalytics();
  const [showModal, setShowModal] = useState(false);
  const [queryParams, setQueryParams] = useQueryParams();

  const shouldAutoOpen = queryParams[QueryParams.SkippedTests] === true;

  // Only fetch the sample when the user deep-links into the modal; there is no
  // other entry point, so fetching on every Tests-tab visit would be wasteful.
  const { data, error, loading } = useQuery<
    TaskQuarantinedTestsSampleQuery,
    TaskQuarantinedTestsSampleQueryVariables
  >(
    TASK_QUARANTINED_TESTS_SAMPLE,
    count > 0 && shouldAutoOpen
      ? {
          variables: {
            versionId,
            taskIds: [taskId],
            limit: MODAL_DISPLAY_LIMIT,
          },
          errorPolicy: "all",
        }
      : skipToken,
  );
  const sample = data?.version.taskQuarantinedTestsSample?.[0];

  // The sample query always reflects the latest execution, while the count is
  // accurate for the selected one; suppress the modal when they disagree.
  const listAvailable = sample !== undefined && sample.execution === execution;

  const [fetchFullList] = useLazyQuery<
    TaskQuarantinedTestsSampleQuery,
    TaskQuarantinedTestsSampleQueryVariables
  >(TASK_QUARANTINED_TESTS_SAMPLE);

  const setModalOpen = (open: boolean) => {
    setShowModal(open);
    if (!open && queryParams[QueryParams.SkippedTests] !== undefined) {
      setQueryParams({
        ...queryParams,
        [QueryParams.SkippedTests]: undefined,
      });
    }
  };

  useEffect(() => {
    if (!shouldAutoOpen || loading) {
      return;
    }
    if (listAvailable) {
      sendEvent({
        name: "Viewed skipped tests modal",
        "tests.skipped_count": count,
      });
      setShowModal(true);
      return;
    }
    setModalOpen(false);
    if (error) {
      dispatchToast.error(
        "There was an error loading the skipped test details.",
      );
      return;
    }
    dispatchToast.warning(
      sample === undefined
        ? "Skipped test details are not available for this execution."
        : "Skipped test details are only available for the latest execution of this task.",
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldAutoOpen, listAvailable, loading, error]);

  const handleDownload = async () => {
    sendEvent({
      name: "Clicked download skipped tests JSON button",
      "tests.skipped_count": count,
    });
    try {
      const { data: fullData } = await fetchFullList({
        variables: { versionId, taskIds: [taskId], limit: FULL_LIST_LIMIT },
      });
      const fullSample = fullData?.version.taskQuarantinedTestsSample?.[0];
      if (!fullSample || fullSample.execution !== execution) {
        throw new Error("no matching skipped test sample returned");
      }
      downloadObjectAsJson(
        buildSkippedTestsJson(fullSample),
        `skipped-tests-${taskId}-${execution}.json`,
      );
    } catch {
      dispatchToast.error(
        "There was an error downloading the skipped test list.",
      );
    }
  };

  if (!listAvailable) {
    return null;
  }

  return (
    <SkippedTestsModal
      columns={columns}
      dataCyPrefix="skipped-tests"
      getSearchText={getEntryName}
      onClickDownload={handleDownload}
      open={showModal}
      rows={sample.quarantinedTests}
      searchPlaceholder="Search test names"
      setOpen={setModalOpen}
      subtitle={`${sample.quarantinedTestsSkippedCount} ${pluralize(
        "test",
        sample.quarantinedTestsSkippedCount,
      )} ${
        sample.quarantinedTestsSkippedCount === 1 ? "was" : "were"
      } skipped by TSS when execution ${formatZeroIndexForDisplay(
        sample.execution,
      )} of this task ran. This snapshot may differ from what TSS would skip now.`}
      totalCount={sample.quarantinedTestsSkippedCount}
    />
  );
};

const getEntryName = ({ displayTestName, testName }: SkippedTestEntry) =>
  displayTestName || testName;

const columns: LGColumnDef<SkippedTestEntry>[] = [
  {
    id: "testName",
    header: "Test Name",
    accessorFn: getEntryName,
    cell: ({ getValue }) => <WordBreak>{getValue() as string}</WordBreak>,
  },
];
