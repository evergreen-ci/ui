import { useEffect, useRef, useState } from "react";
import { useMutation } from "@apollo/client";
import styled from "@emotion/styled";
import { MenuItem } from "@leafygreen-ui/menu";
import { NumberInput } from "@leafygreen-ui/number-input";
import { palette } from "@leafygreen-ui/palette";
import Icon from "@evg-ui/lib/components/Icon";
import Popconfirm from "@evg-ui/lib/components/Popconfirm";
import { size } from "@evg-ui/lib/constants/tokens";
import { useToastContext } from "@evg-ui/lib/context/toast";
import { useVersionAnalytics, useTaskAnalytics } from "analytics";
import {
  SetVersionPriorityMutation,
  SetVersionPriorityMutationVariables,
  SetTaskPriorityMutation,
  SetTaskPriorityMutationVariables,
} from "gql/generated/types";
import { SET_VERSION_PRIORITY, SET_TASK_PRIORITY } from "gql/mutations";

const { gray, red, yellow } = palette;

type SetPriorityProps = (
  | {
      versionId: string;
      taskId?: never;
    }
  | {
      taskId: string;
      versionId?: never;
    }
) & {
  initialPriority?: number;
  disabled?: boolean;
};

const SetPriority: React.FC<SetPriorityProps> = ({
  disabled,
  initialPriority = 0,
  taskId,
  versionId,
}) => {
  // @ts-expect-error: FIXME. This comment was added by an automated script.
  const { sendEvent: sendVersionEvent } = useVersionAnalytics(versionId);
  const { sendEvent: sendTaskEvent } = useTaskAnalytics();
  const dispatchToast = useToastContext();

  const [priority, setPriority] = useState<number>(initialPriority);
  const [open, setOpen] = useState(false);
  const [inputRef, setInputRef] = useState<HTMLInputElement | null>(null);
  const menuItemRef = useRef<HTMLDivElement>(null);

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

  const [setTaskPriority, { loading: loadingSetTaskPriority }] = useMutation<
    SetTaskPriorityMutation,
    SetTaskPriorityMutationVariables
  >(SET_TASK_PRIORITY, {
    onCompleted: (data) => {
      dispatchToast.success(
        // @ts-expect-error: FIXME. This comment was added by an automated script.
        data.setTaskPriority.priority >= 0
          ? `Priority for task updated to ${data.setTaskPriority.priority}`
          : `Task was successfully disabled`,
      );
    },
    onError: (err) => {
      dispatchToast.error(`Error updating priority for task: ${err.message}`);
    },
  });

  const onConfirm = () => {
    if (taskId) {
      setTaskPriority({ variables: { taskId, priority } });
      sendTaskEvent({
        name: "Changed task priority",
        "task.priority": priority,
      });
    } else {
      // @ts-expect-error: FIXME. This comment was added by an automated script.
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

  const dataCy = taskId ? "task" : "patch";

  return (
    <>
      <div ref={menuItemRef}>
        <MenuItem
          active={open}
          data-cy={`prioritize-${dataCy}`}
          disabled={
            disabled || loadingSetVersionPriority || loadingSetTaskPriority
          }
          onClick={() => setOpen(!open)}
        >
          Set priority
        </MenuItem>
      </div>
      <Popconfirm
        align="left"
        confirmText="Set"
        data-cy={`set-${dataCy}-priority-popconfirm`}
        onConfirm={onConfirm}
        open={open}
        refEl={menuItemRef}
        setOpen={setOpen}
      >
        <PriorityInput
          ref={(el) => setInputRef(el)}
          data-cy={`${dataCy}-priority-input`}
          inputClassName="priority-input"
          label="Set new priority"
          min={-1}
          onChange={(e) => setPriority(parseInt(e.target.value, 10))}
          onKeyPress={(e) => {
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

const inputWidth = "180px";

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
