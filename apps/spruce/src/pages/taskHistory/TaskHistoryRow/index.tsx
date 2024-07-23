import { useMemo } from "react";
import { useProjectHealthAnalytics } from "analytics/projectHealth/useProjectHealthAnalytics";
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
const TaskHistoryRow: React.FC<Props> = ({ data, index }) => {
  const { sendEvent } = useProjectHealthAnalytics({ page: "Task history" });
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
          commitType: "active",
        }),
      onClickFoldedGithash: () =>
        sendEvent({
          name: "Clicked commit label",
          link: "githash",
          commitType: "inactive",
        }),
      onClickUpstreamProject: () => {
        sendEvent({
          name: "Clicked commit label",
          link: "upstream project",
          commitType: "active",
        });
      },
      onClickJiraTicket: () => {
        sendEvent({
          name: "Clicked commit label",
          link: "jira",
          commitType: "active",
        });
      },
      onClickFoldedJiraTicket: () => {
        sendEvent({
          name: "Clicked commit label",
          link: "jira",
          commitType: "inactive",
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
      data={data}
      index={index}
      columns={orderedColumns}
      numVisibleCols={visibleColumns.length}
      // @ts-expect-error: FIXME. This comment was added by an automated script.
      selected={data?.selected}
      eventHandlers={eventHandlers}
    />
  );
};

const generateColumns = (
  data: types.CommitRow,
  visibleColumns: string[],
  getTaskMetadata: ReturnType<typeof useTestResults>["getTaskMetadata"],
  sendEvent: ReturnType<typeof useProjectHealthAnalytics>["sendEvent"],
) => {
  const { buildVariants } = data.commit;
  const buildVariantMap = convertArrayToObject(buildVariants, "variant");
  return visibleColumns.map((c) => {
    if (buildVariants) {
      const foundVariant = buildVariantMap[c];
      if (foundVariant) {
        // @ts-expect-error: FIXME. This comment was added by an automated script.
        const { tasks } = foundVariant;
        // the tasks array should in theory only have one item in it so we should always use it.
        const t = tasks[0];
        const { failingTests, inactive, label, loading } = getTaskMetadata(
          t.id,
        );
        return (
          <TaskCell
            onClick={({ taskStatus }) => {
              sendEvent({
                name: "Clicked task cell",
                taskStatus,
              });
            }}
            inactive={inactive}
            key={c}
            task={t}
            failingTests={failingTests}
            label={label}
            loading={loading}
          />
        );
      }
    }
    // Returned if the build variant did not run for this commit
    return <EmptyCell key={`empty_variant_${c}`} />;
  });
};
export default TaskHistoryRow;
