import Tooltip from "@leafygreen-ui/tooltip";
import { Table } from "antd";
import { ColumnProps } from "antd/es/table";
import { SortOrder as antSortOrder } from "antd/lib/table/interface";
import pluralize from "pluralize";
import { TaskStatus } from "@evg-ui/lib/types/task";
import { StyledRouterLink } from "components/styles";
import {
  InputFilterProps,
  getColumnSearchFilterProps,
  getColumnTreeSelectFilterProps,
} from "components/Table/Filters";
import TaskStatusBadgeWithLink from "components/TaskStatusBadgeWithLink";
import { TreeSelectProps } from "components/TreeSelect";
import { getVariantHistoryRoute } from "constants/routes";
import { zIndex } from "constants/tokens";
import {
  Task,
  SortDirection,
  SortOrder,
  TaskSortCategory,
} from "gql/generated/types";
import { TableOnChange } from "types/task";
import { sortTasks } from "utils/statuses";
import { TaskLink } from "./TaskLink";
import { TaskTableInfo } from "./types";

interface TasksTableProps {
  baseStatusSelectorProps?: TreeSelectProps;
  isPatch: boolean;
  loading?: boolean;
  onClickTaskLink?: (taskId: string) => void;
  // @ts-expect-error: FIXME. This comment was added by an automated script.
  onColumnHeaderClick?: (sortField) => void;
  onExpand?: (expanded: boolean) => void;
  showTaskExecutionLabel?: boolean;
  sorts?: SortOrder[];
  statusSelectorProps?: TreeSelectProps;
  tableChangeHandler?: TableOnChange<TaskTableInfo>;
  taskNameInputProps?: InputFilterProps;
  tasks: TaskTableInfo[];
  variantInputProps?: InputFilterProps;
}

const TasksTable: React.FC<TasksTableProps> = ({
  baseStatusSelectorProps,
  isPatch,
  loading = false,
  onClickTaskLink = () => {},
  onColumnHeaderClick,
  onExpand = () => {},
  showTaskExecutionLabel,
  sorts,
  statusSelectorProps,
  tableChangeHandler,
  taskNameInputProps,
  tasks,
  variantInputProps,
}) => (
  <Table
    childrenColumnName="executionTasksFull"
    columns={
      sorts
        ? getColumnDefsWithSort({
            baseStatusSelectorProps,
            isPatch,
            onClickTaskLink,
            onColumnHeaderClick,
            showTaskExecutionLabel,
            sorts,
            statusSelectorProps,
            taskNameInputProps,
            variantInputProps,
          })
        : getColumnDefs({
            baseStatusSelectorProps,
            isPatch,
            onClickTaskLink,
            onColumnHeaderClick,
            showTaskExecutionLabel,
            statusSelectorProps,
            taskNameInputProps,
            variantInputProps,
          })
    }
    data-cy="tasks-table"
    data-loading={loading}
    // @ts-expect-error: FIXME. This comment was added by an automated script.
    dataSource={tasks}
    expandable={{
      onExpand: (expanded) => {
        onExpand(expanded);
      },
    }}
    getPopupContainer={(trigger: HTMLElement) => trigger}
    loading={loading}
    // @ts-expect-error: FIXME. This comment was added by an automated script.
    onChange={tableChangeHandler}
    pagination={false}
    rowKey={rowKey}
  />
);

interface GetColumnDefsParams {
  baseStatusSelectorProps?: TreeSelectProps;
  isPatch: boolean;
  onClickTaskLink: (s: string) => void;
  // @ts-expect-error: FIXME. This comment was added by an automated script.
  onColumnHeaderClick?: (sortField) => void;
  showTaskExecutionLabel?: boolean;
  statusSelectorProps?: TreeSelectProps;
  taskNameInputProps?: InputFilterProps;
  variantInputProps?: InputFilterProps;
}

const getColumnDefs = ({
  baseStatusSelectorProps,
  isPatch,
  onClickTaskLink,
  onColumnHeaderClick = () => undefined,
  showTaskExecutionLabel,
  statusSelectorProps,
  taskNameInputProps,
  variantInputProps,
}: GetColumnDefsParams): ColumnProps<Task>[] => [
  {
    title: "Name",
    dataIndex: "displayName",
    key: TaskSortCategory.Name,
    onHeaderCell: () => ({
      onClick: () => {
        onColumnHeaderClick(TaskSortCategory.Name);
      },
    }),
    sorter: {
      compare: (a, b) => a.displayName.localeCompare(b.displayName),
      multiple: 4,
    },
    width: "40%",
    className: "cy-task-table-col-NAME",
    render: (name: string, { execution, id }: Task): JSX.Element => (
      <TaskLink
        execution={execution}
        onClick={onClickTaskLink}
        showTaskExecutionLabel={showTaskExecutionLabel}
        taskId={id}
        taskName={name}
      />
    ),
    ...(taskNameInputProps &&
      getColumnSearchFilterProps({
        ...taskNameInputProps,
        "data-cy": "taskname-input",
      })),
  },
  {
    title: "Task Status",
    dataIndex: "status",
    key: TaskSortCategory.Status,
    onHeaderCell: () => ({
      onClick: () => {
        onColumnHeaderClick(TaskSortCategory.Status);
      },
    }),
    sorter: {
      compare: (a, b) => sortTasks(a.status, b.status),
      multiple: 4,
    },
    className: "cy-task-table-col-STATUS",
    render: (status: string, { dependsOn, execution, id }) =>
      dependsOn?.length && status === TaskStatus.Blocked ? (
        <Tooltip
          data-cy="depends-on-tooltip"
          justify="middle"
          popoverZIndex={zIndex.tooltip}
          trigger={
            <span>
              <TaskStatusBadgeWithLink
                execution={execution}
                id={id}
                status={status}
              />
            </span>
          }
        >
          Depends on {pluralize("task", dependsOn.length)}:{" "}
          {dependsOn.map(({ name }) => `“${name}”`).join(", ")}
        </Tooltip>
      ) : (
        status && (
          <TaskStatusBadgeWithLink
            execution={execution}
            id={id}
            status={status as TaskStatus}
          />
        )
      ),
    ...(statusSelectorProps && {
      ...getColumnTreeSelectFilterProps({
        ...statusSelectorProps,
        "data-cy": "status-treeselect",
      }),
    }),
  },
  {
    title: `${isPatch ? "Base" : "Previous"} Status`,
    dataIndex: ["baseTask", "status"],
    key: TaskSortCategory.BaseStatus,
    onHeaderCell: () => ({
      onClick: () => {
        onColumnHeaderClick(TaskSortCategory.BaseStatus);
      },
    }),
    sorter: {
      compare: (a, b) => sortTasks(a?.baseTask?.status, b?.baseTask?.status),
      multiple: 4,
    },
    className: "cy-task-table-col-BASE_STATUS",
    render: (status: string, { baseTask }) =>
      status && (
        <TaskStatusBadgeWithLink
          // @ts-expect-error: FIXME. This comment was added by an automated script.
          execution={baseTask.execution}
          // @ts-expect-error: FIXME. This comment was added by an automated script.
          id={baseTask.id}
          status={status as TaskStatus}
        />
      ),
    ...(baseStatusSelectorProps && {
      ...getColumnTreeSelectFilterProps({
        ...baseStatusSelectorProps,
        "data-cy": "base-status-treeselect",
      }),
    }),
  },
  {
    title: "Variant",
    dataIndex: "buildVariantDisplayName",
    key: TaskSortCategory.Variant,
    onHeaderCell: () => ({
      onClick: () => {
        onColumnHeaderClick(TaskSortCategory.Variant);
      },
    }),
    sorter: {
      compare: (a, b) => a.buildVariant.localeCompare(b.buildVariant),
      multiple: 4,
    },
    className: "cy-task-table-col-VARIANT",
    ...(variantInputProps &&
      getColumnSearchFilterProps({
        ...variantInputProps,
        "data-cy": "variant-input",
      })),
    render: (displayName, { buildVariant, projectIdentifier }) => (
      <StyledRouterLink
        // @ts-expect-error: FIXME. This comment was added by an automated script.
        to={getVariantHistoryRoute(projectIdentifier, buildVariant)}
      >
        {displayName}
      </StyledRouterLink>
    ),
  },
];

const getSortDir = (
  key: string,
  sorts: SortOrder[],
): antSortOrder | undefined => {
  const sortKey = sorts.find((sort) => sort.Key === key);
  if (sortKey) {
    return sortKey.Direction === SortDirection.Desc ? "descend" : "ascend";
  }
  return undefined;
};

interface GetColumnDefsWithSort extends GetColumnDefsParams {
  sorts: SortOrder[];
}

const getColumnDefsWithSort = ({
  baseStatusSelectorProps,
  isPatch,
  onClickTaskLink,
  onColumnHeaderClick,
  showTaskExecutionLabel,
  sorts,
  statusSelectorProps,
  taskNameInputProps,
  variantInputProps,
}: GetColumnDefsWithSort): ColumnProps<Task>[] => {
  const sortProps = {
    [TaskSortCategory.Name]: {
      sortOrder: getSortDir(TaskSortCategory.Name, sorts),
    },
    [TaskSortCategory.Status]: {
      sortOrder: getSortDir(TaskSortCategory.Status, sorts),
    },
    [TaskSortCategory.BaseStatus]: {
      sortOrder: getSortDir(TaskSortCategory.BaseStatus, sorts),
    },
    [TaskSortCategory.Variant]: {
      sortOrder: getSortDir(TaskSortCategory.Variant, sorts),
    },
  };

  return getColumnDefs({
    baseStatusSelectorProps,
    isPatch,
    onClickTaskLink,
    onColumnHeaderClick,
    showTaskExecutionLabel,
    statusSelectorProps,
    taskNameInputProps,
    variantInputProps,
  }).map((columnDef) => ({
    ...columnDef,
    // @ts-expect-error: FIXME. This comment was added by an automated script.
    ...sortProps[columnDef.key],
  }));
};

const rowKey = ({ id }: { id: string }): string => id;

export default TasksTable;
