import { LGColumnDef } from "@leafygreen-ui/table";
import Tooltip from "@leafygreen-ui/tooltip";
import pluralize from "pluralize";
import { ConditionalWrapper } from "components/ConditionalWrapper";
import { StyledRouterLink } from "components/styles";
import TaskStatusBadge from "components/TaskStatusBadge";
import { TreeDataEntry } from "components/TreeSelect";
import { getVariantHistoryRoute } from "constants/routes";
import { mergeTaskVariant } from "constants/task";
import { zIndex } from "constants/tokens";
import { TaskSortCategory } from "gql/generated/types";
import { TaskStatus } from "types/task";
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
              <TaskStatusBadge execution={execution} id={id} status={status} />
            </span>
          }
        >
          Depends on {pluralize("task", dependsOn.length)}:{" "}
          {dependsOn.map(({ name }) => `“${name}”`).join(", ")}
        </Tooltip>
      ) : (
        getValue() && (
          <TaskStatusBadge execution={execution} id={id} status={status} />
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
      getValue() && (
        <TaskStatusBadge
          execution={baseTask?.execution}
          id={baseTask?.id}
          status={getValue() as string}
        />
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
      <ConditionalWrapper
        condition={buildVariant !== mergeTaskVariant}
        wrapper={(children) => (
          <StyledRouterLink
            // @ts-expect-error: FIXME. This comment was added by an automated script.
            to={getVariantHistoryRoute(projectIdentifier, buildVariant)}
          >
            {children}
          </StyledRouterLink>
        )}
      >
        {getValue() as string}
      </ConditionalWrapper>
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
