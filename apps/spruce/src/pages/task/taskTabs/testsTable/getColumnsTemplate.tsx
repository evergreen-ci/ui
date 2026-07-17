import styled from "@emotion/styled";
import { Badge, Variant } from "@leafygreen-ui/badge";
import { LGColumnDef } from "@leafygreen-ui/table";
import TestStatusBadge from "@evg-ui/lib/components/Badge/TestStatusBadge";
import { WordBreak } from "@evg-ui/lib/components/styles";
import { size } from "@evg-ui/lib/constants/tokens";
import { testStatusesFilterTreeData } from "constants/test";
import { TaskQuery, TestResult, TestSortCategory } from "gql/generated/types";
import { string } from "utils";
import { ActionMenu } from "./ActionMenu";
import { LogsColumn } from "./LogsColumn";

const { msToDuration } = string;

interface GetColumnsTemplateParams {
  task: NonNullable<TaskQuery["task"]>;
}

export const getColumnsTemplate = ({
  task,
}: GetColumnsTemplateParams): LGColumnDef<TestResult>[] => [
  {
    accessorKey: "testFile",
    cell: ({ getValue, row }) => (
      <NameCell>
        <WordBreak>{getValue() as string}</WordBreak>
        {row.original.isManuallyQuarantined && (
          <Badge data-cy="quarantined-badge" variant={Variant.Yellow}>
            Quarantined
          </Badge>
        )}
      </NameCell>
    ),
    enableColumnFilter: true,
    enableSorting: true,
    header: "Name",
    id: TestSortCategory.TestName,
    meta: {
      search: {
        "data-cy": "test-name-filter",
        placeholder: "Test name regex",
      },
      width: "50%",
    },
  },
  {
    accessorKey: "status",
    cell: ({ getValue }) => <TestStatusBadge status={getValue() as string} />,
    enableColumnFilter: true,
    enableSorting: true,
    header: "Status",
    id: TestSortCategory.Status,
    meta: {
      treeSelect: {
        "data-cy": "status-treeselect",
        options: testStatusesFilterTreeData,
      },
      width: "10%",
    },
  },
  {
    accessorKey: "baseStatus",
    cell: ({ getValue }) => {
      const status = getValue() as string;
      return status && <TestStatusBadge status={status} />;
    },
    enableSorting: true,
    header: () =>
      `${task.versionMetadata.isPatch ? "Base" : "Previous"} Status`,
    id: TestSortCategory.BaseStatus,
    meta: {
      width: "10%",
    },
  },
  {
    accessorKey: "duration",
    cell: ({ getValue }): string => {
      const ms = (getValue() as number) * 1000;
      return msToDuration(Math.trunc(ms));
    },
    enableSorting: true,
    header: "Time",
    id: TestSortCategory.Duration,
    meta: {
      width: "10%",
    },
  },
  {
    cell: ({ row }) => <LogsColumn task={task} testResult={row.original} />,
    enableSorting: false,
    header: "Logs",
    meta: {
      width: "20%",
    },
  },
  {
    cell: ({ row }) => <ActionMenu task={task} test={row.original} />,
    enableSorting: false,
    header: "Actions",
    id: "actions",
    meta: {
      width: "10%",
    },
  },
];

const NameCell = styled.div`
  display: flex;
  align-items: center;
  gap: ${size.xs};
`;
