import { useMemo } from "react";
import styled from "@emotion/styled";
import Badge from "@leafygreen-ui/badge";
import { LeafyGreenTableRow, useLeafyGreenTable } from "@leafygreen-ui/table";
import { formatDistanceToNow } from "date-fns";
import { WordBreak } from "@evg-ui/lib/components/styles";
import { size } from "@evg-ui/lib/constants/tokens";
import HostStatusBadge from "components/HostStatusBadge";
import { DoesNotExpire } from "components/Spawn";
import { BaseTable } from "components/Table/BaseTable";
import { useQueryParam } from "hooks/useQueryParam";
import { MyHost, QueryParams } from "types/spawn";
import SpawnHostCard from "./SpawnHostCard";
import { SpawnHostTableActions } from "./SpawnHostTableActions";

interface SpawnHostTableProps {
  hosts: MyHost[];
}
export const SpawnHostTable: React.FC<SpawnHostTableProps> = ({ hosts }) => {
  const [selectedHost] = useQueryParam(QueryParams.Host, "");

  const dataSource = useMemo(
    () =>
      hosts.map((h) => ({
        ...h,
        renderExpandedContent: (row: LeafyGreenTableRow<MyHost>) => (
          <SpawnHostCard host={row.original} />
        ),
      })),
    [hosts],
  );

  const initialExpanded = Object.fromEntries(
    dataSource.map(({ id }, i) => [i, id === selectedHost]),
  );

  const table = useLeafyGreenTable<MyHost>({
    columns,
    data: dataSource,
    defaultColumn: {
      enableColumnFilter: false,
      enableSorting: false,
      size: "auto" as unknown as number,
      // Handle bug in sorting order
      // https://github.com/TanStack/table/issues/4289
      sortDescFirst: false,
    },
    initialState: {
      expanded: initialExpanded,
    },
  });

  return <BaseTable shouldAlternateRowColor table={table} />;
};

const columns = [
  {
    header: "Host",
    accessorKey: "id",
    enableSorting: true,
    // @ts-expect-error: FIXME. This comment was added by an automated script.
    cell: ({ getValue, row }) => {
      const id = getValue();
      return row.original.distro?.isVirtualWorkStation ? (
        <FlexContainer>
          <NoWrap>{row.original.displayName || id}</NoWrap>
          <Badge>Workstation</Badge>
        </FlexContainer>
      ) : (
        <WordBreak>{row.original.displayName || id}</WordBreak>
      );
    },
  },
  {
    header: "Distro",
    // @ts-expect-error: FIXME. This comment was added by an automated script.
    accessorFn: ({ distro: { id } }) => id,
    enableSorting: true,
    // @ts-expect-error: FIXME. This comment was added by an automated script.
    cell: ({ getValue }) => <WordBreak>{getValue()}</WordBreak>,
  },
  {
    header: "Status",
    accessorKey: "status",
    enableSorting: true,
    // @ts-expect-error: FIXME. This comment was added by an automated script.
    cell: ({ getValue }) => <HostStatusBadge status={getValue()} />,
  },
  {
    header: "Expires In",
    // @ts-expect-error: FIXME. This comment was added by an automated script.
    accessorFn: ({ expiration }) => new Date(expiration),
    enableSorting: true,
    // @ts-expect-error: FIXME. This comment was added by an automated script.
    cell: ({ getValue, row }) =>
      row.original.noExpiration
        ? DoesNotExpire
        : formatDistanceToNow(getValue()),
  },
  {
    header: "Uptime",
    // @ts-expect-error: FIXME. This comment was added by an automated script.
    accessorFn: ({ uptime }) => new Date(uptime),
    enableSorting: true,
    // @ts-expect-error: FIXME. This comment was added by an automated script.
    cell: ({ getValue }) => formatDistanceToNow(getValue()),
  },
  {
    header: "Actions",
    // @ts-expect-error: FIXME. This comment was added by an automated script.
    cell: ({ row }) => <SpawnHostTableActions host={row.original} />,
  },
];

const FlexContainer = styled.div`
  align-items: baseline;
  display: flex;
  gap: ${size.xs};
`;

const NoWrap = styled.span`
  white-space: nowrap;
`;
