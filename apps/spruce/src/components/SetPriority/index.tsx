import { useEffect, useRef, useState } from "react";
import { useMutation } from "@apollo/client";
import styled from "@emotion/styled";
import Button, { Size as ButtonSize } from "@leafygreen-ui/button";
import { MenuItem } from "@leafygreen-ui/menu";
import { NumberInput } from "@leafygreen-ui/number-input";
import { palette } from "@leafygreen-ui/palette";
import pluralize from "pluralize";
import Icon from "@evg-ui/lib/components/Icon";
import Popconfirm, { Align, Justify } from "@evg-ui/lib/components/Popconfirm";
import { size } from "@evg-ui/lib/constants/tokens";
import { useToastContext } from "@evg-ui/lib/context/toast";
import { useVersionAnalytics, useTaskAnalytics } from "analytics";
import {
  SetVersionPriorityMutation,
  SetVersionPriorityMutationVariables,
  SetTaskPrioritiesMutation,
  SetTaskPrioritiesMutationVariables,
} from "gql/generated/types";
import { SET_VERSION_PRIORITY, SET_TASK_PRIORITIES } from "gql/mutations";

const { gray, red, yellow } = palette;

export { Align, Justify };

type SetPriorityProps = (
  | {
      versionId: string;
      taskIds?: never;
    }
  | {
      taskIds: string[];
      versionId?: never;
    }
) & {
  disabled?: boolean;
  initialPriority?: number;
  isButton?: boolean;
  popconfirmAlign?: Align;
  popconfirmJustify?: Justify;
};

const SetPriority: React.FC<SetPriorityProps> = ({
  disabled,
  initialPriority = 0,
  isButton = false,
  popconfirmAlign = Align.Left,
  popconfirmJustify = Justify.Start,
  taskIds,
  versionId,
}) => {
  // @ts-expect-error: FIXME. This comment was added by an automated script.
  const { sendEvent: sendVersionEvent } = useVersionAnalytics(versionId);
  const { sendEvent: sendTaskEvent } = useTaskAnalytics();
  const dispatchToast = useToastContext();

  const [priority, setPriority] = useState<number>(initialPriority);
  const [open, setOpen] = useState(false);
  const [inputRef, setInputRef] = useState<HTMLInputElement | null>(null);
  const menuItemRef = useRef<HTMLButtonElement>(null);

  const [setVersionPriority, { loading: loadingSetVersionPriority }] =
    useMutation<
      SetVersionPriorityMutation,
      SetVersionPriorityMutationVariables
    >(SET_VERSION_PRIORITY, {
      onCompleted: () => {
        dispatchToast.success(`Priority was set to ${priority}`);
      },
      onError: (err) => {
        dispatchToast.error(
          `Error updating priority for patch: ${err.message}`,
        );
      },
    });

  const [setTaskPriorities, { loading: loadingSetTaskPriorities }] =
    useMutation<SetTaskPrioritiesMutation, SetTaskPrioritiesMutationVariables>(
      SET_TASK_PRIORITIES,
      {
        onCompleted: (data) => {
          dispatchToast.success(
            data.setTaskPriorities.some(({ priority: p }) => (p ?? 0) >= 0)
              ? `Priority updated for ${data.setTaskPriorities.length} ${pluralize("tasks", data.setTaskPriorities.length)}.`
              : `${pluralize("Task", data.setTaskPriorities.length)} successfully disabled.`,
          );
        },
        onError: (err) => {
          dispatchToast.error(
            `Error updating priority for task: ${err.message}`,
          );
        },
      },
    );

  const onConfirm = () => {
    if (taskIds) {
      setTaskPriorities({
        variables: {
          taskPriorities: taskIds.map((taskId) => ({ taskId, priority })),
        },
      });
      sendTaskEvent({
        name: "Changed task priority",
        "task.priority": priority,
      });
    } else {
      setVersionPriority({ variables: { versionId, priority } });
      sendVersionEvent({
        name: "Changed version priority",
        "version.priority": priority,
      });
    }
  };

  useEffect(() => {
    inputRef?.focus();
    inputRef?.select();
  }, [inputRef]);

  const label = taskIds ? "task" : "patch";

  return (
    <>
      {isButton ? (
        <Button
          ref={menuItemRef}
          data-cy="set-priority-button"
          disabled={
            disabled || loadingSetVersionPriority || loadingSetTaskPriorities
          }
          onClick={() => setOpen(!open)}
          size={ButtonSize.XSmall}
        >
          Set priority
        </Button>
      ) : (
        <MenuItem
          ref={menuItemRef}
          active={open}
          data-cy="set-priority-menu-item"
          disabled={
            disabled || loadingSetVersionPriority || loadingSetTaskPriorities
          }
          onClick={() => setOpen(!open)}
        >
          Set {label} priority
          {(taskIds?.length ?? 0) > 1 && ` (${taskIds?.length})`}
        </MenuItem>
      )}
      <Popconfirm
        align={popconfirmAlign}
        confirmText="Set"
        data-cy={`set-${label}-priority-popconfirm`}
        justify={popconfirmJustify}
        onConfirm={onConfirm}
        open={open}
        refEl={menuItemRef}
        setOpen={setOpen}
      >
        <PriorityInput
          ref={(el) => setInputRef(el)}
          data-cy={`${label}-priority-input`}
          inputClassName="priority-input"
          label="Set New Priority"
          min={-1}
          onChange={(e) => setPriority(parseInt(e.target.value, 10))}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              onConfirm();
              setOpen(false);
            }
          }}
          value={priority.toString()}
        />
        {priority >= 0 && priority < 50 && (
          <Message data-cy="priority-default-message" type="default">
            <StyledIcon glyph="InfoWithCircle" />
            <span>
              Use with discretion for tasks you&apos;re actively waiting on.
            </span>
          </Message>
        )}
        {priority >= 50 && priority < 100 && (
          <Message data-cy="priority-warning-message" type="warning">
            <StyledIcon glyph="ImportantWithCircle" />
            <span>Please ensure that this is a high priority change.</span>
          </Message>
        )}
        {priority >= 100 && (
          <Message data-cy="priority-admin-message" type="admin">
            <StyledIcon glyph="Warning" />
            <span>
              This is admin-restricted and should only be used in emergencies.
            </span>
          </Message>
        )}
      </Popconfirm>
    </>
  );
};

const inputWidth = "200px";

const PriorityInput = styled(NumberInput)`
  .priority-input {
    width: ${inputWidth};
  }
`;

const Message = styled.div<{ type: "default" | "warning" | "admin" }>`
  width: ${inputWidth};
  display: flex;
  align-items: flex-start;
  gap: ${size.xxs};
  margin-top: ${size.xxs};

  color: ${({ type }) => type === "default" && gray.light1};
  color: ${({ type }) => type === "warning" && yellow.base};
  color: ${({ type }) => type === "admin" && red.light1};
`;

const StyledIcon = styled(Icon)`
  flex-shrink: 0;
  margin-top: 2px;
`;

export default SetPriority;
