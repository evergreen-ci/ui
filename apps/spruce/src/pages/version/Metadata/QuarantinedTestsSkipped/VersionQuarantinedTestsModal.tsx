import { useMemo } from "react";
import { skipToken, useLazyQuery, useQuery } from "@apollo/client/react";
import pluralize from "pluralize";
import { StyledRouterLink, WordBreak } from "@evg-ui/lib/components/styles";
import { LGColumnDef } from "@evg-ui/lib/components/Table";
import { useToastContext } from "@evg-ui/lib/context/toast";
import { useVersionAnalytics } from "analytics";
import { QuarantinedTestsModal } from "components/QuarantinedTestsModal";
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
  buildQuarantinedTestsJson,
  downloadJsonBlob,
} from "pages/task/taskTabs/testsTable/QuarantinedTests/utils";
import { TaskTab } from "types/task";

export type VersionQuarantinedTask =
  VersionQuarantinedTasksQuery["version"]["tasks"]["data"][number];

interface VersionQuarantinedTestRow {
  buildVariantDisplayName: string;
  execution: number;
  taskDisplayName: string;
  taskId: string;
  testName: string;
}

interface VersionQuarantinedTestsModalProps {
  open: boolean;
  quarantinedTasks: VersionQuarantinedTask[];
  setOpen: (open: boolean) => void;
  totalCount: number;
  versionId: string;
}

export const VersionQuarantinedTestsModal: React.FC<
  VersionQuarantinedTestsModalProps
> = ({ open, quarantinedTasks, setOpen, totalCount, versionId }) => {
  const dispatchToast = useToastContext();
  const { sendEvent } = useVersionAnalytics(versionId);

  const taskIds = useMemo(
    () => quarantinedTasks.map((task) => task.id),
    [quarantinedTasks],
  );
  const taskById = useMemo(
    () => new Map(quarantinedTasks.map((task) => [task.id, task])),
    [quarantinedTasks],
  );

  const { data: samplesData, loading } = useQuery<
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

  const rows: VersionQuarantinedTestRow[] = useMemo(
    () =>
      (samplesData?.version.taskQuarantinedTestsSample ?? []).flatMap(
        (sample) => {
          const task = taskById.get(sample.taskId);
          return sample.quarantinedTests.map(
            ({ displayTestName, testName }) => ({
              buildVariantDisplayName: task?.buildVariantDisplayName ?? "",
              execution: sample.execution,
              taskDisplayName: task?.displayName ?? sample.taskId,
              taskId: sample.taskId,
              testName: displayTestName || testName,
            }),
          );
        },
      ),
    [samplesData, taskById],
  );

  const handleDownload = async () => {
    sendEvent({
      name: "Clicked download version quarantined tests JSON button",
    });
    try {
      const { data: fullData } = await fetchFullList({
        variables: { versionId, taskIds, limit: FULL_LIST_LIMIT },
      });
      const samples = fullData?.version.taskQuarantinedTestsSample;
      if (!samples || samples.length === 0) {
        throw new Error("no quarantined test samples returned");
      }
      downloadJsonBlob(
        {
          versionId,
          quarantinedTestsSkippedCount: totalCount,
          tasks: samples.map((sample) => ({
            taskDisplayName: taskById.get(sample.taskId)?.displayName ?? "",
            buildVariantDisplayName:
              taskById.get(sample.taskId)?.buildVariantDisplayName ?? "",
            ...buildQuarantinedTestsJson(sample),
          })),
        },
        `quarantined-tests-${versionId}.json`,
      );
    } catch {
      dispatchToast.error(
        "There was an error downloading the quarantined test list.",
      );
    }
  };

  return (
    <QuarantinedTestsModal
      columns={columns}
      dataCyPrefix="version-quarantined-tests"
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
}: VersionQuarantinedTestRow) => `${testName} ${taskDisplayName}`;

const columns: LGColumnDef<VersionQuarantinedTestRow>[] = [
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
        data-cy="version-quarantined-tests-task-link"
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
