import { useEffect, useRef, useState } from "react";
import { useMutation } from "@apollo/client/react";
import { Button, Size as ButtonSize } from "@leafygreen-ui/button";
import { MenuItem } from "@leafygreen-ui/menu";
import { NumberInput } from "@leafygreen-ui/number-input";
import pluralize from "pluralize";
import Icon from "@evg-ui/lib/components/Icon";
import Popconfirm, { Align, Justify } from "@evg-ui/lib/components/Popconfirm";
import { useToastContext } from "@evg-ui/lib/context/toast";
import { cx } from "@evg-ui/lib/utils/css";
import { useTaskAnalytics, useVersionAnalytics } from "analytics";
import {
  SetTaskPrioritiesMutation,
  SetTaskPrioritiesMutationVariables,
  SetVersionPriorityMutation,
  SetVersionPriorityMutationVariables,
} from "gql/generated/types";
import { SET_TASK_PRIORITIES, SET_VERSION_PRIORITY } from "gql/mutations";
import styles from "./index.module.css";

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
  const disableButton =
    disabled || loadingSetVersionPriority || loadingSetTaskPriorities;

  return (
    <>
      {isButton ? (
        <Button
          ref={menuItemRef}
          data-testid="set-priority-button"
          disabled={disableButton}
          onClick={() => setOpen(!open)}
          size={ButtonSize.XSmall}
        >
          Set priority
        </Button>
      ) : (
        <MenuItem
          ref={menuItemRef}
          active={open}
          data-testid="set-priority-menu-item"
          disabled={disableButton}
          onClick={() => setOpen(!open)}
        >
          Set {label} priority
          {(taskIds?.length ?? 0) > 1 && ` (${taskIds?.length})`}
        </MenuItem>
      )}
      <Popconfirm
        align={popconfirmAlign}
        confirmText="Set"
        data-testid={`set-${label}-priority-popconfirm`}
        justify={popconfirmJustify}
        onConfirm={onConfirm}
        open={open}
        refEl={menuItemRef}
        setOpen={setOpen}
      >
        <NumberInput
          ref={(el) => setInputRef(el)}
          className={styles.priorityInput}
          data-testid={`${label}-priority-input`}
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
          <div
            className={cx(styles.message, styles.messageDefault)}
            data-testid="priority-default-message"
          >
            <Icon className={styles.icon} glyph="InfoWithCircle" />
            <span>
              Use with discretion for tasks you&apos;re actively waiting on.
            </span>
          </div>
        )}
        {priority >= 50 && priority < 100 && (
          <div
            className={cx(styles.message, styles.messageWarning)}
            data-testid="priority-warning-message"
          >
            <Icon className={styles.icon} glyph="ImportantWithCircle" />
            <span>Please ensure that this is a high priority change.</span>
          </div>
        )}
        {priority >= 100 && (
          <div
            className={cx(styles.message, styles.messageAdmin)}
            data-testid="priority-admin-message"
          >
            <Icon className={styles.icon} glyph="Warning" />
            <span>
              This is admin-restricted and should only be used in emergencies.
            </span>
          </div>
        )}
      </Popconfirm>
    </>
  );
};

export default SetPriority;
