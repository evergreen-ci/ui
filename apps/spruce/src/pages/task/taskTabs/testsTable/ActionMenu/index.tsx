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

  const [quarantineTest] = useMutation<
    QuarantineTestMutation,
    QuarantineTestMutationVariables
  >(QUARANTINE_TEST, {
    onCompleted: (data) => {
      if (data?.quarantineTest?.success) {
        dispatchToast.success("Successfully quarantined test.");
      } else {
        dispatchToast.error("Failed to quarantine test.");
      }
    },
    onError: (err) => {
      dispatchToast.error(
        `Error when attempting to quarantine test: ${err.message}`,
      );
    },
    update: (cache, { data }) => {
      if (!data?.quarantineTest?.success) return;
      cache.modify({
        id: cache.identify({ __typename: "TestResult", id: test.id }),
        fields: {
          isManuallyQuarantined: () => true,
        },
      });
    },
  });

  const [unquarantineTest] = useMutation<
    UnquarantineTestMutation,
    UnquarantineTestMutationVariables
  >(UNQUARANTINE_TEST, {
    onCompleted: (data) => {
      if (data?.unquarantineTest?.success) {
        dispatchToast.success("Successfully unquarantined test.");
      } else {
        dispatchToast.error("Failed to unquarantine test.");
      }
    },
    onError: (err) => {
      dispatchToast.error(
        `Error when attempting to unquarantine test: ${err.message}`,
      );
    },
    update: (cache, { data }) => {
      if (!data?.unquarantineTest?.success) return;
      cache.modify({
        id: cache.identify({ __typename: "TestResult", id: test.id }),
        fields: {
          isManuallyQuarantined: () => false,
        },
      });
    },
  });

  const onQuarantineTest = () => {
    sendEvent({
      name: "Clicked quarantine test button",
      "test.name": test.testFile,
    });
    quarantineTest({ variables: { taskId: task.id, testName: test.testFile } });
  };

  const onUnquarantineTest = () => {
    sendEvent({
      name: "Clicked unquarantine test button",
      "test.name": test.testFile,
    });
    unquarantineTest({
      variables: { taskId: task.id, testName: test.testFile },
    });
  };

  let dropdownItems: React.ReactNode[];
  if (!task.testSelectionEnabled) {
    dropdownItems = [
      <DropdownItem key="disabled" disabled>
        Test selection is disabled for this task.
      </DropdownItem>,
    ];
  } else if (task.displayOnly) {
    dropdownItems = [
      <DropdownItem key="display-task" disabled>
        Select an execution task to manage test quarantine status.
      </DropdownItem>,
    ];
  } else if (test.isManuallyQuarantined) {
    dropdownItems = [
      <DropdownItem
        key="unquarantine"
        data-cy="unquarantine-test"
        description="This test is currently quarantined."
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
    <ButtonDropdown dropdownItems={dropdownItems} size={ButtonSize.XSmall} />
  );
};
