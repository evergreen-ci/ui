import { useEffect, useMemo } from "react";
import { skipToken, useLazyQuery, useQuery } from "@apollo/client/react";
import pluralize from "pluralize";
import { StyledRouterLink, WordBreak } from "@evg-ui/lib/components/styles";
import { LGColumnDef } from "@evg-ui/lib/components/Table";
import { useToastContext } from "@evg-ui/lib/context/toast";
import { downloadObjectAsJson } from "@evg-ui/lib/utils/request";
import { useVersionAnalytics } from "analytics";
import { SkippedTestsModal } from "components/SkippedTestsModal";
import { getTaskRoute } from "constants/routes";
import {
  TaskQuarantinedTestsSampleQuery,
  TaskQuarantinedTestsSampleQueryVariables,
  VersionQuarantinedTasksQuery,
} from "gql/generated/types";
import { TASK_QUARANTINED_TESTS_SAMPLE } from "gql/queries";
import {
  FULL_LIST_LIMIT,
  MODAL_DISPLAY_LIMIT,
  buildSkippedTestsJson,
} from "pages/task/metadata/ExecutionSection/SkippedTestsMetadata/utils";
import { TaskTab } from "types/task";

export type VersionSkippedTestTask =
  VersionQuarantinedTasksQuery["version"]["tasks"]["data"][number];

interface VersionSkippedTestRow {
  buildVariantDisplayName: string;
  execution: number;
  taskDisplayName: string;
  taskId: string;
  testName: string;
}

interface VersionSkippedTestsModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  skippedTestTasks: VersionSkippedTestTask[];
  totalCount: number;
  versionId: string;
}

export const VersionSkippedTestsModal: React.FC<
  VersionSkippedTestsModalProps
> = ({ open, setOpen, skippedTestTasks, totalCount, versionId }) => {
  const dispatchToast = useToastContext();
  const { sendEvent } = useVersionAnalytics(versionId);

  const taskIds = useMemo(
    () => skippedTestTasks.map((task) => task.id),
    [skippedTestTasks],
  );
  const taskById = useMemo(
    () => new Map(skippedTestTasks.map((task) => [task.id, task])),
    [skippedTestTasks],
  );

  const {
    data: samplesData,
    error,
    loading,
  } = useQuery<
    TaskQuarantinedTestsSampleQuery,
    TaskQuarantinedTestsSampleQueryVariables
  >(
    TASK_QUARANTINED_TESTS_SAMPLE,
    taskIds.length > 0
      ? {
          variables: { versionId, taskIds, limit: MODAL_DISPLAY_LIMIT },
          errorPolicy: "all",
        }
      : skipToken,
  );

  const [fetchFullList] = useLazyQuery<
    TaskQuarantinedTestsSampleQuery,
    TaskQuarantinedTestsSampleQueryVariables
  >(TASK_QUARANTINED_TESTS_SAMPLE);

  const samples = samplesData?.version.taskQuarantinedTestsSample;
  const detailsAvailable = samples != null && samples.length > 0;

  useEffect(() => {
    if (loading) {
      return;
    }
    if (detailsAvailable) {
      sendEvent({ name: "Viewed version skipped tests modal" });
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
      "Skipped test details are not available for this version.",
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [detailsAvailable, loading, error]);

  const rows: VersionSkippedTestRow[] = useMemo(
    () =>
      (samples ?? []).flatMap((sample) => {
        const task = taskById.get(sample.taskId);
        return sample.quarantinedTests.map(({ displayTestName, testName }) => ({
          buildVariantDisplayName: task?.buildVariantDisplayName ?? "",
          execution: sample.execution,
          taskDisplayName: task?.displayName ?? sample.taskId,
          taskId: sample.taskId,
          testName: displayTestName || testName,
        }));
      }),
    [samples, taskById],
  );

  const handleDownload = async () => {
    sendEvent({
      name: "Clicked download version skipped tests JSON button",
    });
    try {
      const { data: fullData } = await fetchFullList({
        variables: { versionId, taskIds, limit: FULL_LIST_LIMIT },
      });
      const fullSamples = fullData?.version.taskQuarantinedTestsSample;
      if (!fullSamples || fullSamples.length === 0) {
        throw new Error("no skipped test samples returned");
      }
      downloadObjectAsJson(
        {
          versionId,
          skippedTestCount: totalCount,
          tasks: fullSamples.map((sample) => ({
            taskDisplayName: taskById.get(sample.taskId)?.displayName ?? "",
            buildVariantDisplayName:
              taskById.get(sample.taskId)?.buildVariantDisplayName ?? "",
            ...buildSkippedTestsJson(sample),
          })),
        },
        `skipped-tests-${versionId}.json`,
      );
    } catch {
      dispatchToast.error(
        "There was an error downloading the skipped test list.",
      );
    }
  };

  return (
    <SkippedTestsModal
      columns={columns}
      dataCyPrefix="version-skipped-tests"
      getSearchText={getRowSearchText}
      loading={loading}
      onClickDownload={handleDownload}
      open={open}
      rows={rows}
      searchPlaceholder="Search test or task names"
      setOpen={setOpen}
      subtitle={`${totalCount} ${pluralize("test", totalCount)} ${
        totalCount === 1 ? "was" : "were"
      } skipped by TSS when this version's tasks ran. This snapshot may differ from what TSS would skip now.`}
      totalCount={totalCount}
    />
  );
};

const getRowSearchText = ({
  taskDisplayName,
  testName,
}: VersionSkippedTestRow) => `${testName} ${taskDisplayName}`;

const columns: LGColumnDef<VersionSkippedTestRow>[] = [
  {
    id: "testName",
    header: "Test Name",
    accessorKey: "testName",
    cell: ({ getValue }) => <WordBreak>{getValue() as string}</WordBreak>,
  },
  {
    id: "task",
    header: "Task",
    accessorKey: "taskDisplayName",
    cell: ({
      row: {
        original: { execution, taskDisplayName, taskId },
      },
    }) => (
      <StyledRouterLink
        data-cy="version-skipped-tests-task-link"
        to={getTaskRoute(taskId, {
          execution,
          tab: TaskTab.Tests,
        })}
      >
        <WordBreak>{taskDisplayName}</WordBreak>
      </StyledRouterLink>
    ),
  },
  {
    id: "variant",
    header: "Variant",
    accessorKey: "buildVariantDisplayName",
  },
];
