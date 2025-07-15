import Tooltip from "@leafygreen-ui/tooltip";
import pluralize from "pluralize";
import TaskStatusBadge from "@evg-ui/lib/components/Badge/TaskStatusBadge";
import { StyledRouterLink } from "@evg-ui/lib/components/styles";
import { LGColumnDef } from "@evg-ui/lib/components/Table";
import { TreeDataEntry } from "@evg-ui/lib/components/TreeSelect";
import { zIndex } from "@evg-ui/lib/constants/tokens";
import { TaskStatus } from "@evg-ui/lib/types/task";
import TaskStatusBadgeWithLink from "components/TaskStatusBadgeWithLink";
import { showTaskReviewUI } from "constants/featureFlags";
import { getVariantHistoryRoute } from "constants/routes";
import { TaskSortCategory } from "gql/generated/types";
import { ReviewedCheckbox } from "./ReviewedCheckbox";
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
  ...(showTaskReviewUI
    ? [
        {
          header: "Reviewed",
          accessorKey: "reviewed",
          enableColumnFilter: false,
          size: 0,
          cell: ({ row }) => <ReviewedCheckbox row={row} />,
        } as LGColumnDef<TaskTableInfo>, // This typing can be removed when the feature flag is deleted
      ]
    : []),
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
    accessorKey: "displayStatus",
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
    accessorKey: "baseTask.displayStatus",
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
