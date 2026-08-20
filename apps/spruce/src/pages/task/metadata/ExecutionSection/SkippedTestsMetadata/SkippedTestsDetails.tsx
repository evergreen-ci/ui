import { useEffect } from "react";
import { useLazyQuery, useQuery } from "@apollo/client/react";
import pluralize from "pluralize";
import { WordBreak } from "@evg-ui/lib/components/styles";
import { LGColumnDef } from "@evg-ui/lib/components/Table";
import { useToastContext } from "@evg-ui/lib/context/toast";
import { downloadObjectAsJson } from "@evg-ui/lib/utils/request";
import { useTaskAnalytics } from "analytics";
import { SkippedTestsModal } from "components/SkippedTestsModal";
import {
  TaskQuarantinedTestsSampleQuery,
  TaskQuarantinedTestsSampleQueryVariables,
} from "gql/generated/types";
import { TASK_QUARANTINED_TESTS_SAMPLE } from "gql/queries";
import { formatZeroIndexForDisplay } from "utils/numbers";
import {
  FULL_LIST_LIMIT,
  MODAL_DISPLAY_LIMIT,
  SkippedTestsSample,
  buildSkippedTestsJson,
} from "./utils";

type SkippedTestEntry = SkippedTestsSample["quarantinedTests"][number];

interface SkippedTestsDetailsProps {
  count: number;
  execution: number;
  setOpen: (open: boolean) => void;
  taskId: string;
  versionId: string;
}

export const SkippedTestsDetails: React.FC<SkippedTestsDetailsProps> = ({
  count,
  execution,
  setOpen,
  taskId,
  versionId,
}) => {
  const dispatchToast = useToastContext();
  const { sendEvent } = useTaskAnalytics();
  const { data, error, loading } = useQuery<
    TaskQuarantinedTestsSampleQuery,
    TaskQuarantinedTestsSampleQueryVariables
  >(TASK_QUARANTINED_TESTS_SAMPLE, {
    variables: {
      versionId,
      taskIds: [taskId],
      limit: MODAL_DISPLAY_LIMIT,
    },
    errorPolicy: "all",
  });
  const sample = data?.version.taskQuarantinedTestsSample?.[0];

  // The sample query always reflects the latest execution, while the count is
  // accurate for the selected one; suppress the modal when they disagree.
  const listAvailable = sample !== undefined && sample.execution === execution;

  const [fetchFullList] = useLazyQuery<
    TaskQuarantinedTestsSampleQuery,
    TaskQuarantinedTestsSampleQueryVariables
  >(TASK_QUARANTINED_TESTS_SAMPLE);

  useEffect(() => {
    if (loading) {
      return;
    }
    if (listAvailable) {
      sendEvent({
        name: "Viewed skipped tests modal",
        "tests.skipped_count": count,
      });
      return;
    }
    setOpen(false);
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
  }, [listAvailable, loading, error]);

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

  if (!loading && !listAvailable) {
    return null;
  }

  const rows = listAvailable ? sample.quarantinedTests : [];
  const totalCount = listAvailable
    ? sample.quarantinedTestsSkippedCount
    : count;

  return (
    <SkippedTestsModal
      columns={columns}
      getSearchText={getEntryName}
      loading={loading}
      onClickDownload={handleDownload}
      open
      rows={rows}
      searchPlaceholder="Search test names"
      setOpen={setOpen}
      subtitle={`${totalCount} ${pluralize("test", totalCount)} ${
        totalCount === 1 ? "was" : "were"
      } skipped by TSS when execution ${formatZeroIndexForDisplay(
        execution,
      )} of this task ran. This snapshot may differ from what TSS would skip now.`}
      totalCount={totalCount}
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
