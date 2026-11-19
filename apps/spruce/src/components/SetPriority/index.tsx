import { useEffect, useRef, useState } from "react";
import { useMutation } from "@apollo/client/react";
import { Button, Size as ButtonSize } from "@leafygreen-ui/button";
import { Align, Side, TextField } from "@via-ds/components";
import pluralize from "pluralize";
import Icon from "@evg-ui/lib/components/Icon";
import Popconfirm from "@evg-ui/lib/components/Popconfirm";
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
  onOpenChange?: (open: boolean) => void;
  open?: boolean;
  refEl?: React.RefObject<HTMLElement | null>;
  popconfirmSide?: Side;
  popconfirmAlign?: Align;
};

const INTEGER_PATTERN = /^-?\d+$/;
const PARTIAL_INTEGER_PATTERN = /^-?\d*$/;

const SetPriority: React.FC<SetPriorityProps> = ({
  disabled,
  initialPriority = 0,
  isButton = false,
  onOpenChange,
  open: controlledOpen,
  popconfirmAlign,
  popconfirmSide = Side.Left,
  refEl,
  taskIds,
  versionId,
}) => {
  // @ts-expect-error: FIXME. This comment was added by an automated script.
  const { sendEvent: sendVersionEvent } = useVersionAnalytics(versionId);
  const { sendEvent: sendTaskEvent } = useTaskAnalytics();
  const dispatchToast = useToastContext();

  const [input, setInput] = useState(initialPriority.toString());
  const isValidPriority = INTEGER_PATTERN.test(input);
  const priority = isValidPriority ? parseInt(input, 10) : NaN;
  const [internalOpen, setInternalOpen] = useState(false);
  const [inputRef, setInputRef] = useState<HTMLInputElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const open = controlledOpen ?? internalOpen;
  const setOpen = onOpenChange ?? setInternalOpen;

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
      {isButton && (
        <Button
          ref={buttonRef}
          data-testid="set-priority-button"
          disabled={disableButton}
          onClick={() => setOpen(!open)}
          size={ButtonSize.XSmall}
        >
          Set priority
        </Button>
      )}
      <Popconfirm
        align={popconfirmAlign ?? (refEl ? Align.Center : Align.Start)}
        confirmDisabled={!isValidPriority}
        confirmText="Set"
        data-testid={`set-${label}-priority-popconfirm`}
        onConfirm={onConfirm}
        open={open}
        refEl={isButton ? buttonRef : refEl}
        setOpen={setOpen}
        side={popconfirmSide}
      >
        <TextField
          ref={(el) => setInputRef(el)}
          className={styles.priorityInput}
          data-testid={`${label}-priority-input`}
          inputMode="numeric"
          label="Set New Priority"
          onChange={(value) => {
            if (PARTIAL_INTEGER_PATTERN.test(value)) {
              setInput(value);
            }
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && isValidPriority) {
              onConfirm();
              setOpen(false);
            }
          }}
          value={input}
        />
        <div className={styles.messageSlot}>
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
        </div>
      </Popconfirm>
    </>
  );
};

export default SetPriority;
