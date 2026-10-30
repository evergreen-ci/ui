import { palette } from "@leafygreen-ui/palette";
import { Justify, Tooltip } from "@leafygreen-ui/tooltip";
import { Align, InfoSprinkle, Side } from "@via-ds/components";
import pluralize from "pluralize";
import TaskStatusBadge from "@evg-ui/lib/components/Badge/TaskStatusBadge";
import IconWithTooltip from "@evg-ui/lib/components/IconWithTooltip";
import { StyledRouterLink } from "@evg-ui/lib/components/styles";
import { LGColumnDef } from "@evg-ui/lib/components/Table";
import { TreeDataEntry } from "@evg-ui/lib/components/TreeSelect";
import { TaskStatus } from "@evg-ui/lib/types/task";
import TaskStatusBadgeWithLink from "components/TaskStatusBadgeWithLink";
import {
  PreferencesTabRoutes,
  getPreferencesRoute,
  getVariantHistoryRoute,
} from "constants/routes";
import { TaskSortCategory } from "gql/generated/types";
import { TaskTab } from "types/task";
import styles from "./Columns.module.css";
import { ReviewedToggle } from "./ReviewedToggle";
import { TaskLink } from "./TaskLink";
import { TaskTableInfo } from "./types";

export const getColumnsTemplate = ({
  baseStatusOptions = [],
  isPatch = false,
  onClickTaskLink = () => {},
  onClickTaskStatusBadge = () => {},
  showTaskExecutionLabel = false,
  statusOptions = [],
}: {
  baseStatusOptions?: TreeDataEntry[];
  isPatch?: boolean;
  onClickTaskLink?: (taskId: string, status?: string) => void;
  onClickTaskStatusBadge?: (
    taskId: string,
    status: string,
    column: string,
  ) => void;
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
        original: { displayStatus, execution, id },
      },
    }): React.JSX.Element => (
      <TaskLink
        execution={execution}
        onClick={() => onClickTaskLink(id, displayStatus)}
        showTaskExecutionLabel={showTaskExecutionLabel}
        taskId={id}
        taskName={getValue() as string}
      />
    ),
    meta: {
      search: {
        "data-testid": "task-name-filter",
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
      column,
      getValue,
      row: {
        original: { dependsOn, errors, execution, id },
      },
    }) => {
      const status = getValue() as string;
      const hasErrors = errors && errors.length > 0;

      if (dependsOn?.length && getValue() === TaskStatus.Blocked) {
        return (
          <Tooltip
            data-testid="depends-on-tooltip"
            justify={Justify.Middle}
            trigger={
              <span>
                <TaskStatusBadgeWithLink
                  execution={execution}
                  id={id}
                  onClick={() => onClickTaskStatusBadge(id, status, column.id)}
                  status={status as TaskStatus}
                />
              </span>
            }
          >
            Depends on {pluralize("task", dependsOn.length)}:{" "}
            {dependsOn.map(({ name }) => `“${name}”`).join(", ")}
          </Tooltip>
        );
      }

      return (
        <div className={styles.flexWrapper}>
          <TaskStatusBadgeWithLink
            execution={execution}
            id={id}
            onClick={() => onClickTaskStatusBadge(id, status, column.id)}
            status={status as TaskStatus}
          />
          {hasErrors && (
            <IconWithTooltip color={palette.red.base} glyph="Warning">
              {errors.join(", ")}
            </IconWithTooltip>
          )}
        </div>
      );
    },
    meta: {
      treeSelect: {
        "data-testid": "status-filter",
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
      column,
      getValue,
      row: {
        original: { baseTask, id },
      },
    }) => {
      const status = getValue() as TaskStatus;
      return baseTask ? (
        <TaskStatusBadgeWithLink
          execution={baseTask?.execution}
          id={baseTask?.id}
          onClick={() => onClickTaskStatusBadge(id, status, column.id)}
          status={status}
        />
      ) : (
        <TaskStatusBadge status={status} />
      );
    },
    meta: {
      treeSelect: {
        "data-testid": "base-status-filter",
        options: baseStatusOptions,
      },
    },
    enableSorting: true,
    size: 80,
  },
  {
    accessorKey: "baseTask.prevTaskCompleted",
    id: "last-run-status",
    header: () => (
      <div className={styles.flexWrapper}>
        Last Run Status
        <InfoSprinkle align={Align.End} side={Side.Top}>
          For {isPatch ? "base" : "previous"} tasks that have not finished
          running, this column links to the most recent completed commit.
        </InfoSprinkle>
      </div>
    ),
    cell: ({
      column,
      getValue,
      row: {
        original: { id },
      },
    }) => {
      const prevTaskCompleted = getValue() as NonNullable<
        TaskTableInfo["baseTask"]
      >["prevTaskCompleted"];

      if (prevTaskCompleted) {
        return (
          <TaskStatusBadgeWithLink
            execution={prevTaskCompleted.execution}
            id={prevTaskCompleted.id}
            onClick={() =>
              onClickTaskStatusBadge(
                id,
                prevTaskCompleted.displayStatus,
                column.id,
              )
            }
            status={prevTaskCompleted.displayStatus as TaskStatus}
            tab={TaskTab.History}
          />
        );
      }

      return null;
    },
    enableColumnFilter: false,
  },
  {
    accessorKey: "buildVariantDisplayName",
    id: TaskSortCategory.Variant,
    header: "Variant",
    cell: ({
      getValue,
      row: {
        original: { buildVariant, project },
      },
    }) => {
      const variant = getValue() as string;
      return project?.identifier ? (
        <StyledRouterLink
          to={getVariantHistoryRoute(project.identifier, buildVariant)}
        >
          {variant}
        </StyledRouterLink>
      ) : (
        variant
      );
    },
    meta: {
      search: {
        "data-testid": "variant-filter",
        placeholder: "Variant name regex",
      },
    },
    enableSorting: true,
    size: 250,
  },
  {
    header: () => (
      <div className={styles.flexWrapper}>
        Reviewed
        <InfoSprinkle align={Align.End} side={Side.Top}>
          <span>
            Mark unsuccessful tasks as reviewed. This is saved only on this
            machine and can be turned off in{" "}
            <StyledRouterLink
              to={getPreferencesRoute(PreferencesTabRoutes.UISettings)}
            >
              UI Settings
            </StyledRouterLink>
            .
          </span>
        </InfoSprinkle>
      </div>
    ),
    accessorKey: "reviewed",
    enableColumnFilter: false,
    size: 20,
    cell: ({ row }) => <ReviewedToggle row={row} />,
  } as LGColumnDef<TaskTableInfo>,
];
