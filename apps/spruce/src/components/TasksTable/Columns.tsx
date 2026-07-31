import styled from "@emotion/styled";
import { InfoSprinkle } from "@leafygreen-ui/info-sprinkle";
import { palette } from "@leafygreen-ui/palette";
import { Justify, Tooltip } from "@leafygreen-ui/tooltip";
import pluralize from "pluralize";
import TaskStatusBadge from "@evg-ui/lib/components/Badge/TaskStatusBadge";
import IconWithTooltip from "@evg-ui/lib/components/IconWithTooltip";
import { StyledRouterLink } from "@evg-ui/lib/components/styles";
import { LGColumnDef } from "@evg-ui/lib/components/Table";
import { TreeDataEntry } from "@evg-ui/lib/components/TreeSelect";
import { size } from "@evg-ui/lib/constants/tokens";
import { TaskStatus } from "@evg-ui/lib/types/task";
import { AnnouncementPopover } from "components/TaskReview/AnnouncementPopover";
import TaskStatusBadgeWithLink from "components/TaskStatusBadgeWithLink";
import { getVariantHistoryRoute } from "constants/routes";
import { TaskSortCategory } from "gql/generated/types";
import { TaskTab } from "types/task";
import { ReviewedCheckbox } from "./ReviewedCheckbox";
import { TaskLink } from "./TaskLink";
import { TaskTableInfo } from "./types";

export const getColumnsTemplate = ({
  baseStatusOptions = [],
  isPatch = false,
  loading = false,
  onClickTaskLink = () => {},
  onClickTaskStatusBadge = () => {},
  showTaskExecutionLabel = false,
  statusOptions = [],
}: {
  baseStatusOptions?: TreeDataEntry[];
  isPatch?: boolean;
  loading?: boolean;
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
    header: () => (
      <>
        Reviewed <AnnouncementPopover loading={loading} />
      </>
    ),
    accessorKey: "reviewed",
    enableColumnFilter: false,
    size: 0,
    cell: ({ row }) => <ReviewedCheckbox row={row} />,
  } as LGColumnDef<TaskTableInfo>,
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
            data-cy="depends-on-tooltip"
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
        <FlexWrapper>
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
        </FlexWrapper>
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
        "data-cy": "base-status-filter",
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
      <FlexWrapper>
        Last Run Status
        <InfoSprinkle>
          For {isPatch ? "base" : "previous"} tasks that have not finished
          running, this column links to the most recent completed commit.
        </InfoSprinkle>
      </FlexWrapper>
    ),
    cell: ({ getValue }) => {
      const prevTaskCompleted = getValue() as NonNullable<
        TaskTableInfo["baseTask"]
      >["prevTaskCompleted"];

      if (prevTaskCompleted) {
        return (
          <TaskStatusBadgeWithLink
            execution={prevTaskCompleted.execution}
            id={prevTaskCompleted.id}
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
        "data-cy": "variant-filter",
        placeholder: "Variant name regex",
      },
    },
    enableSorting: true,
    size: 250,
  },
];

const FlexWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: ${size.xxs};
`;
