import { useMutation } from "@apollo/client";
import { Size as ButtonSize } from "@leafygreen-ui/button";
import { LGColumnDef } from "@leafygreen-ui/table";
import TestStatusBadge from "@evg-ui/lib/components/Badge/TestStatusBadge";
import { WordBreak } from "@evg-ui/lib/components/styles";
import { useToastContext } from "@evg-ui/lib/context/toast";
import { TestStatus } from "@evg-ui/lib/types/test";
import { useTaskAnalytics } from "analytics";
import { ButtonDropdown, DropdownItem } from "components/ButtonDropdown";
import { testStatusesFilterTreeData } from "constants/test";
import {
  TestSortCategory,
  TaskQuery,
  TestResult,
  QuarantineTestMutation,
  QuarantineTestMutationVariables,
} from "gql/generated/types";
import { QUARANTINE_TEST } from "gql/mutations";
import { string } from "utils";
import { LogsColumn } from "./LogsColumn";

const { msToDuration } = string;

interface GetColumnsTemplateParams {
  task: NonNullable<TaskQuery["task"]>;
}

export const getColumnsTemplate = ({
  task,
}: GetColumnsTemplateParams): LGColumnDef<TestResult>[] => [
  {
    header: "Name",
    accessorKey: "testFile",
    id: TestSortCategory.TestName,
    cell: ({ getValue }) => <WordBreak>{getValue() as string}</WordBreak>,
    enableColumnFilter: true,
    enableSorting: true,
    meta: {
      search: {
        "data-cy": "test-name-filter",
        placeholder: "Test name regex",
      },
      width: "50%",
    },
  },
  {
    header: "Status",
    accessorKey: "status",
    id: TestSortCategory.Status,
    enableColumnFilter: true,
    enableSorting: true,
    cell: ({ getValue }) => <TestStatusBadge status={getValue() as string} />,
    meta: {
      treeSelect: {
        "data-cy": "status-treeselect",
        options: testStatusesFilterTreeData,
      },
      width: "10%",
    },
  },
  {
    header: () =>
      `${task.versionMetadata.isPatch ? "Base" : "Previous"} Status`,
    accessorKey: "baseStatus",
    id: TestSortCategory.BaseStatus,
    enableSorting: true,
    cell: ({ getValue }) => {
      const status = getValue() as string;
      return status && <TestStatusBadge status={status} />;
    },
    meta: {
      width: "10%",
    },
  },
  {
    header: "Time",
    accessorKey: "duration",
    id: TestSortCategory.Duration,
    enableSorting: true,
    cell: ({ getValue }): string => {
      const ms = (getValue() as number) * 1000;
      return msToDuration(Math.trunc(ms));
    },
    meta: {
      width: "10%",
    },
  },
  {
    header: "Logs",
    enableSorting: false,
    cell: ({ row }) => <LogsColumn task={task} testResult={row.original} />,
    meta: {
      width: "20%",
    },
  },
  {
    header: "Actions",
    id: "actions",
    enableSorting: false,
    cell: ({ row }) => <ActionMenu task={task} test={row.original} />,
    meta: {
      width: "10%",
    },
  },
];

interface ActionMenuProps {
  task: NonNullable<TaskQuery["task"]>;
  test: TestResult;
}

const ActionMenu: React.FC<ActionMenuProps> = ({ task, test }) => {
  const { sendEvent } = useTaskAnalytics();
  const dispatchToast = useToastContext();

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
  };

  const canQuarantine = test.status === TestStatus.Fail;

  const dropdownItems = [
    <DropdownItem
      key="quarantine"
      description={
        canQuarantine
          ? "Quarantine test so that it does not run in future task runs."
          : "Passing tests cannot be quarantined."
      }
      disabled={!canQuarantine}
      onClick={() => onQuarantineTest()}
    >
      Quarantine
    </DropdownItem>,
  ];

  return (
    <ButtonDropdown dropdownItems={dropdownItems} size={ButtonSize.XSmall} />
  );
};
