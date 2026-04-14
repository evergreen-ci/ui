import { useState } from "react";
import { useLazyQuery, useMutation } from "@apollo/client/react";
import { Size as ButtonSize } from "@leafygreen-ui/button";
import { useToastContext } from "@evg-ui/lib/context/toast";
import { useTaskAnalytics } from "analytics";
import { ButtonDropdown, DropdownItem } from "components/ButtonDropdown";
import {
  TaskQuery,
  TestResult,
  QuarantineTestMutation,
  QuarantineTestMutationVariables,
  UnquarantineTestMutation,
  UnquarantineTestMutationVariables,
  QuarantineStatusQuery,
  QuarantineStatusQueryVariables,
} from "gql/generated/types";
import { QUARANTINE_TEST, UNQUARANTINE_TEST } from "gql/mutations";
import { QUARANTINE_STATUS } from "gql/queries";

interface ActionMenuProps {
  task: NonNullable<TaskQuery["task"]>;
  test: TestResult;
}

export const ActionMenu: React.FC<ActionMenuProps> = ({ task, test }) => {
  const { sendEvent } = useTaskAnalytics();
  const dispatchToast = useToastContext();

  const [menuOpen, setMenuOpen] = useState(false);

  const [
    fetchStatus,
    { data: statusData, error: statusError, loading: statusLoading },
  ] = useLazyQuery<QuarantineStatusQuery, QuarantineStatusQueryVariables>(
    QUARANTINE_STATUS,
    {
      fetchPolicy: "network-only",
    },
  );

  const handleOpenChange: React.Dispatch<React.SetStateAction<boolean>> = (
    value,
  ) => {
    const newOpen = typeof value === "function" ? value(menuOpen) : value;
    setMenuOpen(newOpen);
    if (newOpen) {
      fetchStatus({ variables: { taskId: task.id, testName: test.testFile } });
    }
  };

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
    refetchQueries: ["QuarantineStatus"],
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
    refetchQueries: ["QuarantineStatus"],
  });

  const isQuarantined = statusData?.quarantineStatus?.isQuarantined ?? false;

  const onQuarantineTest = () => {
    sendEvent({
      name: "Clicked quarantine test button",
      "test.name": test.testFile,
    });
    quarantineTest({ variables: { taskId: task.id, testName: test.testFile } });
    setMenuOpen(false);
  };

  const onUnquarantineTest = () => {
    sendEvent({
      name: "Clicked unquarantine test button",
      "test.name": test.testFile,
    });
    unquarantineTest({
      variables: { taskId: task.id, testName: test.testFile },
    });
    setMenuOpen(false);
  };

  let dropdownItems;
  if (statusLoading) {
    dropdownItems = [
      <DropdownItem key="loading" disabled>
        Loading quarantine status...
      </DropdownItem>,
    ];
  } else if (statusError) {
    const isNotFound = statusError.message.toLowerCase().includes("not found");
    dropdownItems = [
      <DropdownItem key="error" disabled>
        {isNotFound
          ? "Quarantine status not found."
          : "Failed to fetch quarantine status."}
      </DropdownItem>,
    ];
  } else if (statusData) {
    dropdownItems = [
      isQuarantined ? (
        <DropdownItem
          key="unquarantine"
          data-cy="unquarantine-test"
          description="This test is currently quarantined."
          onClick={onUnquarantineTest}
        >
          Unquarantine
        </DropdownItem>
      ) : (
        <DropdownItem
          key="quarantine"
          data-cy="quarantine-test"
          description="This test is not currently quarantined."
          onClick={onQuarantineTest}
        >
          Quarantine
        </DropdownItem>
      ),
    ];
  }

  return (
    <ButtonDropdown
      dropdownItems={dropdownItems}
      open={menuOpen}
      setOpen={handleOpenChange}
      size={ButtonSize.XSmall}
    />
  );
};
