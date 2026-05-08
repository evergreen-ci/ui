import styled from "@emotion/styled";
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
import { ReviewedCheckbox } from "./ReviewedCheckbox";
import { TaskLink } from "./TaskLink";
import { TaskTableInfo } from "./types";

export const getColumnsTemplate = ({
  baseStatusOptions = [],
  isPatch = false,
  loading = false,
  onClickTaskLink = () => {},
  showTaskExecutionLabel = false,
  statusOptions = [],
}: {
  baseStatusOptions?: TreeDataEntry[];
  isPatch?: boolean;
  loading?: boolean;
  onClickTaskLink?: (taskId: string) => void;
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
        original: { execution, id },
      },
    }): React.JSX.Element => (
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
        <TaskBadgeWrapper>
          <TaskStatusBadgeWithLink
            execution={execution}
            id={id}
            status={status as TaskStatus}
          />
          {hasErrors && (
            <IconWithTooltip color={palette.red.base} glyph="Warning">
              {errors.join(", ")}
            </IconWithTooltip>
          )}
        </TaskBadgeWrapper>
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

const TaskBadgeWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: ${size.xxs};
`;
