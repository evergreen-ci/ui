import { LGColumnDef } from "@leafygreen-ui/table";
import Tooltip from "@leafygreen-ui/tooltip";
import pluralize from "pluralize";
import TaskStatusBadge from "@evg-ui/lib/components/Badge/TaskStatusBadge";
import { TaskStatus } from "@evg-ui/lib/types/task";
import { StyledRouterLink } from "components/styles";
import TaskStatusBadgeWithLink from "components/TaskStatusBadgeWithLink";
import { TreeDataEntry } from "components/TreeSelect";
import { getVariantHistoryRoute } from "constants/routes";
import { zIndex } from "constants/tokens";
import { TaskSortCategory } from "gql/generated/types";
import { TaskLink } from "./TaskLink";
import { TaskTableInfo } from "./types";

export const getColumnsTemplate = ({
  baseStatusOptions = [],
  isPatch = false,
  onClickTaskLink = () => {},
  showTaskExecutionLabel = false,
  statusOptions = [],
}: {
  baseStatusOptions?: TreeDataEntry[];
  isPatch?: boolean;
  onClickTaskLink?: (taskId: string) => void;
  showTaskExecutionLabel?: boolean;
  statusOptions?: TreeDataEntry[];
}): LGColumnDef<TaskTableInfo>[] => [
  {
    header: "Name",
    accessorKey: "displayName",
    id: TaskSortCategory.Name,
    cell: ({
      getValue,
      row: {
        original: { execution, id },
      },
    }): JSX.Element => (
      <TaskLink
        execution={execution}
        onClick={onClickTaskLink}
        showTaskExecutionLabel={showTaskExecutionLabel}
        taskId={id}
        taskName={getValue() as string}
      />
    ),
    meta: {
      search: {
        "data-cy": "task-name-filter",
        placeholder: "Task name regex",
      },
    },
    enableSorting: true,
    size: 300,
  },
  {
    accessorKey: "status",
    id: TaskSortCategory.Status,
    header: "Task Status",
    cell: ({
      getValue,
      row: {
        original: { dependsOn, execution, id },
      },
    }) => {
      const status = getValue() as string;

      return dependsOn?.length && getValue() === TaskStatus.Blocked ? (
        <Tooltip
          data-cy="depends-on-tooltip"
          justify="middle"
          popoverZIndex={zIndex.tooltip}
          trigger={
            <span>
              <TaskStatusBadgeWithLink
                execution={execution}
                id={id}
                status={status as TaskStatus}
              />
            </span>
          }
        >
          Depends on {pluralize("task", dependsOn.length)}:{" "}
          {dependsOn.map(({ name }) => `“${name}”`).join(", ")}
        </Tooltip>
      ) : (
        getValue() && (
          <TaskStatusBadgeWithLink
            execution={execution}
            id={id}
            status={status as TaskStatus}
          />
        )
      );
    },
    meta: {
      treeSelect: {
        "data-cy": "status-filter",
        options: statusOptions,
      },
    },
    enableSorting: true,
    size: 80,
  },
  {
    id: TaskSortCategory.BaseStatus,
    accessorKey: "baseTask.status",
    header: `${isPatch ? "Base" : "Previous"} Status`,
    cell: ({
      getValue,
      row: {
        original: { baseTask },
      },
    }) =>
      baseTask ? (
        <TaskStatusBadgeWithLink
          execution={baseTask?.execution}
          id={baseTask?.id}
          status={getValue() as TaskStatus}
        />
      ) : (
        <TaskStatusBadge status={getValue() as TaskStatus} />
      ),
    meta: {
      treeSelect: {
        "data-cy": "base-status-filter",
        options: baseStatusOptions,
      },
    },
    enableSorting: true,
    size: 80,
  },
  {
    accessorKey: "buildVariantDisplayName",
    id: TaskSortCategory.Variant,
    header: "Variant",
    cell: ({
      getValue,
      row: {
        original: { buildVariant, projectIdentifier },
      },
    }) => (
      <StyledRouterLink
        // @ts-expect-error: FIXME. This comment was added by an automated script.
        to={getVariantHistoryRoute(projectIdentifier, buildVariant)}
      >
        {getValue() as string}
      </StyledRouterLink>
    ),
    meta: {
      search: {
        "data-cy": "variant-filter",
        placeholder: "Variant name regex",
      },
    },
    enableSorting: true,
    size: 250,
  },
];
