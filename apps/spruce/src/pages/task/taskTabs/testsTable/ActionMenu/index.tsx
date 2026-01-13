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
} from "gql/generated/types";
import { QUARANTINE_TEST } from "gql/mutations";

interface ActionMenuProps {
  task: NonNullable<TaskQuery["task"]>;
  test: TestResult;
}

export const ActionMenu: React.FC<ActionMenuProps> = ({ task, test }) => {
  const { sendEvent } = useTaskAnalytics();
  const dispatchToast = useToastContext();

  const [menuOpen, setMenuOpen] = useState(false);

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

  const onQuarantineTest = () => {
    sendEvent({
      name: "Clicked quarantine test button",
      "test.name": test.testFile,
    });
    quarantineTest({ variables: { taskId: task.id, testName: test.testFile } });
    setMenuOpen(false);
  };

  const canQuarantine = test.status === TestStatus.Fail;

  const dropdownItems = [
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

  return (
    <ButtonDropdown
      dropdownItems={dropdownItems}
      open={menuOpen}
      setOpen={setMenuOpen}
      size={ButtonSize.XSmall}
    />
  );
};
