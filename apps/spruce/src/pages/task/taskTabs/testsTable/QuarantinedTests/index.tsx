import { useEffect, useState } from "react";
import { skipToken, useLazyQuery, useQuery } from "@apollo/client/react";
import pluralize from "pluralize";
import { WordBreak } from "@evg-ui/lib/components/styles";
import { LGColumnDef } from "@evg-ui/lib/components/Table";
import { useToastContext } from "@evg-ui/lib/context/toast";
import { useQueryParams } from "@evg-ui/lib/hooks";
import { useTaskAnalytics } from "analytics";
import { QuarantinedTestsModal } from "components/QuarantinedTestsModal";
import {
  TaskQuarantinedTestsSampleQuery,
  TaskQuarantinedTestsSampleQueryVariables,
  TaskQuery,
} from "gql/generated/types";
import { TASK_QUARANTINED_TESTS_SAMPLE } from "gql/queries";
import { QueryParams } from "types/task";
import { formatZeroIndexForDisplay } from "utils/numbers";
import {
  buildQuarantinedTestsJson,
  downloadJsonBlob,
  FULL_LIST_LIMIT,
  MODAL_DISPLAY_LIMIT,
  QuarantinedTestsSample,
} from "./utils";

type QuarantinedTestEntry = QuarantinedTestsSample["quarantinedTests"][number];

interface QuarantinedTestsProps {
  task: NonNullable<TaskQuery["task"]>;
}

export const QuarantinedTests: React.FC<QuarantinedTestsProps> = ({ task }) => {
  const { execution, id: taskId, quarantinedTestsSkippedCount: count } = task;
  const versionId = task.versionMetadata.id;
  const dispatchToast = useToastContext();
  const { sendEvent } = useTaskAnalytics();
  const [showModal, setShowModal] = useState(false);
  const [queryParams, setQueryParams] = useQueryParams();

  const { data } = useQuery<
    TaskQuarantinedTestsSampleQuery,
    TaskQuarantinedTestsSampleQueryVariables
  >(
    TASK_QUARANTINED_TESTS_SAMPLE,
    count > 0
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
  const sample = data?.taskQuarantinedTestsSample?.[0];

  // The sample query always reflects the latest execution, while the count is
  // accurate for the selected one; suppress the modal when they disagree.
  const listAvailable = sample !== undefined && sample.execution === execution;

  const [fetchFullList] = useLazyQuery<
    TaskQuarantinedTestsSampleQuery,
    TaskQuarantinedTestsSampleQueryVariables
  >(TASK_QUARANTINED_TESTS_SAMPLE);

  const setModalOpen = (open: boolean) => {
    setShowModal(open);
    if (!open && queryParams[QueryParams.QuarantinedTests] !== undefined) {
      setQueryParams({
        ...queryParams,
        [QueryParams.QuarantinedTests]: undefined,
      });
    }
  };

  const shouldAutoOpen = queryParams[QueryParams.QuarantinedTests] === true;
  useEffect(() => {
    if (shouldAutoOpen && listAvailable) {
      sendEvent({
        name: "Viewed quarantined tests modal",
        "tests.skipped_count": count,
      });
      setShowModal(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldAutoOpen, listAvailable]);

  const handleDownload = async () => {
    sendEvent({
      name: "Clicked download quarantined tests JSON button",
      "tests.skipped_count": count,
    });
    try {
      const { data: fullData } = await fetchFullList({
        variables: { versionId, taskIds: [taskId], limit: FULL_LIST_LIMIT },
      });
      const fullSample = fullData?.taskQuarantinedTestsSample?.[0];
      if (!fullSample) {
        throw new Error("no quarantined test sample returned");
      }
      downloadJsonBlob(
        buildQuarantinedTestsJson(fullSample),
        `quarantined-tests-${taskId}-${execution}.json`,
      );
    } catch {
      dispatchToast.error(
        "There was an error downloading the quarantined test list.",
      );
    }
  };

  if (!listAvailable) {
    return null;
  }

  return (
    <QuarantinedTestsModal
      columns={columns}
      dataCyPrefix="quarantined-tests"
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
      } quarantined in TSS when execution ${formatZeroIndexForDisplay(
        sample.execution,
      )} of this task ran. This snapshot may not match the current quarantine state.`}
      totalCount={sample.quarantinedTestsSkippedCount}
    />
  );
};

const getEntryName = ({ displayTestName, testName }: QuarantinedTestEntry) =>
  displayTestName || testName;

const columns: LGColumnDef<QuarantinedTestEntry>[] = [
  {
    id: "testName",
    header: "Test Name",
    accessorFn: getEntryName,
    cell: ({ getValue }) => <WordBreak>{getValue() as string}</WordBreak>,
  },
];
