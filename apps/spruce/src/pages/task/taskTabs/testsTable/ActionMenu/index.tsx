import { useState } from "react";
import { useMutation } from "@apollo/client/react";
import { Size as ButtonSize } from "@leafygreen-ui/button";
import { useToastContext } from "@evg-ui/lib/context/toast";
import { TestStatus } from "@evg-ui/lib/types/test";
import { useTaskAnalytics } from "analytics";
import { ButtonDropdown, DropdownItem } from "components/ButtonDropdown";
import {
  TaskQuery,
  TestResult,
  QuarantineTestMutation,
  QuarantineTestMutationVariables,
  UnquarantineTestMutation,
  UnquarantineTestMutationVariables,
} from "gql/generated/types";
import { QUARANTINE_TEST, UNQUARANTINE_TEST } from "gql/mutations";

interface ActionMenuProps {
  task: NonNullable<TaskQuery["task"]>;
  test: TestResult;
}

export const ActionMenu: React.FC<ActionMenuProps> = ({ task, test }) => {
  const { sendEvent } = useTaskAnalytics();
  const dispatchToast = useToastContext();
  const [open, setOpen] = useState(false);

  const [quarantineTest] = useMutation<
    QuarantineTestMutation,
    QuarantineTestMutationVariables
  >(QUARANTINE_TEST, {
    onCompleted: () => {
      dispatchToast.success("Successfully quarantined test.");
    },
    onError: (err) => {
      dispatchToast.error(
        `Error when attempting to quarantine test: ${err.message}`,
      );
    },
  });

  const [unquarantineTest] = useMutation<
    UnquarantineTestMutation,
    UnquarantineTestMutationVariables
  >(UNQUARANTINE_TEST, {
    onCompleted: () => {
      dispatchToast.success("Successfully unquarantined test.");
    },
    onError: (err) => {
      dispatchToast.error(
        `Error when attempting to unquarantine test: ${err.message}`,
      );
    },
  });

  const onQuarantineTest = () => {
    setOpen(false);
    // Fall back to task.id since the field is nullable in the schema; for non-display tasks the two IDs are equal.
    const taskId = test.taskId ?? task.id;
    sendEvent({
      name: "Clicked quarantine test button",
      "test.name": test.testFile,
      "test.task_id": taskId,
    });
    quarantineTest({
      variables: { taskId, testName: test.testFile },
    });
  };

  const onUnquarantineTest = () => {
    setOpen(false);
    const taskId = test.taskId ?? task.id;
    sendEvent({
      name: "Clicked unquarantine test button",
      "test.name": test.testFile,
      "test.task_id": taskId,
    });
    unquarantineTest({
      variables: { taskId, testName: test.testFile },
    });
  };

  let dropdownItems: React.ReactNode[];
  if (!task.testSelectionEnabled) {
    dropdownItems = [
      <DropdownItem key="disabled" disabled>
        Test selection did not run for this task, so its tests cannot be
        quarantined. Test selection is only available on patch builds for build
        variants and tasks configured for it.
      </DropdownItem>,
    ];
  } else if (test.isManuallyQuarantined) {
    dropdownItems = [
      <DropdownItem
        key="unquarantine"
        data-cy="unquarantine-test"
        description="Allow this test to run in future task runs."
        onClick={onUnquarantineTest}
      >
        Unquarantine
      </DropdownItem>,
    ];
  } else {
    const canQuarantine = test.status === TestStatus.Fail;
    dropdownItems = [
      <DropdownItem
        key="quarantine"
        data-cy="quarantine-test"
        description={
          canQuarantine
            ? "Quarantine test so that it does not run in future task runs."
            : "Passing tests cannot be quarantined."
        }
        disabled={!canQuarantine}
        onClick={onQuarantineTest}
      >
        Quarantine
      </DropdownItem>,
    ];
  }

  return (
    <ButtonDropdown
      dropdownItems={dropdownItems}
      open={open}
      setOpen={setOpen}
      size={ButtonSize.XSmall}
    />
  );
};
