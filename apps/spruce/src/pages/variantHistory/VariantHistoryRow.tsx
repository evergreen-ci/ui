import { useMemo } from "react";
import { useProjectHistoryAnalytics } from "analytics/projectHistory/useProjectHistoryAnalytics";
import { context, Cell, types, hooks } from "components/HistoryTable";
import BaseRow from "components/HistoryTable/HistoryTableRow/BaseRow";
import { array } from "utils";

const { convertArrayToObject } = array;
const { EmptyCell, TaskCell } = Cell;
const { useHistoryTable } = context;
const { useTestResults } = hooks;
const { rowType } = types;

interface Props {
  index: number;
  data: types.CommitRowType;
}
const VariantHistoryRow: React.FC<Props> = ({ data, index }) => {
  const { sendEvent } = useProjectHistoryAnalytics({ page: "Variant history" });
  // @ts-expect-error: FIXME. This comment was added by an automated script.
  const { visibleColumns } = useHistoryTable();

  const { getTaskMetadata } = useTestResults(index);
  const orderedColumns = useMemo(
    () =>
      data.type === rowType.COMMIT
        ? generateColumns(data, visibleColumns, getTaskMetadata, sendEvent)
        : [],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [visibleColumns, getTaskMetadata],
  );
  const eventHandlers = useMemo(
    () => ({
      onClickGithash: () =>
        sendEvent({
          name: "Clicked commit label",
          link: "githash",
          "commit.type": "active",
        }),
      onClickFoldedGithash: () =>
        sendEvent({
          name: "Clicked commit label",
          link: "githash",
          "commit.type": "inactive",
        }),
      onClickUpstreamProject: () => {
        sendEvent({
          name: "Clicked commit label",
          link: "upstream project",
          "commit.type": "active",
        });
      },
      onClickFoldedUpstreamProject: () => {
        sendEvent({
          name: "Clicked commit label",
          link: "upstream project",
          "commit.type": "inactive",
        });
      },
      onClickJiraTicket: () => {
        sendEvent({
          name: "Clicked commit label",
          link: "jira",
          "commit.type": "active",
        });
      },
      onClickFoldedJiraTicket: () => {
        sendEvent({
          name: "Clicked commit label",
          link: "jira",
          "commit.type": "inactive",
        });
      },
      // @ts-expect-error: FIXME. This comment was added by an automated script.
      onToggleFoldedCommit: ({ isVisible }) => {
        sendEvent({
          name: "Toggled folded commit",
          toggle: isVisible ? "open" : "close",
        });
      },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  return (
    <BaseRow
      columns={orderedColumns}
      data={data}
      eventHandlers={eventHandlers}
      index={index}
      numVisibleCols={visibleColumns.length}
      // @ts-expect-error: FIXME. This comment was added by an automated script.
      selected={data?.selected}
    />
  );
};

const generateColumns = (
  data: types.CommitRow,
  visibleColumns: string[],
  getTaskMetadata: ReturnType<typeof useTestResults>["getTaskMetadata"],
  sendEvent: ReturnType<typeof useProjectHistoryAnalytics>["sendEvent"],
) => {
  const { buildVariants } = data.commit;
  return visibleColumns.map((c) => {
    if (buildVariants && buildVariants.length > 0) {
      const { tasks } = buildVariants[0];
      if (!tasks) {
        return <EmptyCell key={`empty_task_${c}`} />;
      }
      const taskMap = convertArrayToObject(tasks, "displayName");
      const t = taskMap[c];
      if (t) {
        const { failingTests, inactive, label, loading } = getTaskMetadata(
          t.id,
        );
        return (
          <TaskCell
            key={c}
            failingTests={failingTests}
            inactive={inactive}
            label={label}
            loading={loading}
            onClick={({ taskStatus }) => {
              sendEvent({
                name: "Clicked task cell",
                "task.status": taskStatus,
              });
            }}
            task={t}
          />
        );
      }
    }
    // Returned if the task did not run for this commit
    return <EmptyCell key={`empty_task_${c}`} />;
  });
};

export default VariantHistoryRow;
