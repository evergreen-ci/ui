import { useMemo, useState } from "react";
import styled from "@emotion/styled";
import { Badge } from "@leafygreen-ui/badge";
import { formatDistanceToNow } from "date-fns";
import {
  WordBreak,
  ExpandedState,
  LeafyGreenTableRow,
  useLeafyGreenTable,
  BaseTable,
  LGColumnDef,
} from "@evg-ui/lib/components";
import { size } from "@evg-ui/lib/constants";
import { useQueryParam } from "@evg-ui/lib/hooks";
import HostStatusBadge from "components/HostStatusBadge";
import { DoesNotExpire } from "components/Spawn";
import { HostStatus } from "types/host";
import { MyHost, QueryParams } from "types/spawn";
import SpawnHostCard from "./SpawnHostCard";
import { SpawnHostTableActions } from "./SpawnHostTableActions";

interface SpawnHostTableProps {
  hosts: MyHost[];
}

export const SpawnHostTable: React.FC<SpawnHostTableProps> = ({ hosts }) => {
  const [selectedHost] = useQueryParam(QueryParams.Host, "");

  const hostData = useMemo(
    () =>
      hosts.map((h) => ({
        ...h,
        renderExpandedContent,
      })),
    [hosts],
  );

  const initialExpanded = Object.fromEntries(
    hostData.map(({ id }, i) => [i, id === selectedHost]),
  );
  // Remove and use initialState instead when LG-5035 is complete.
  const [expanded, setExpanded] = useState<ExpandedState>(initialExpanded);

  const table = useLeafyGreenTable<MyHost>({
    columns,
    data: hostData,
    defaultColumn: {
      enableColumnFilter: false,
      enableSorting: false,
      size: "auto" as unknown as number,
      // Handle bug in sorting order
      // https://github.com/TanStack/table/issues/4289
      sortDescFirst: false,
    },
    onExpandedChange: setExpanded,
    state: {
      expanded,
    },
  });

  return <BaseTable shouldAlternateRowColor table={table} />;
};

const renderExpandedContent = (row: LeafyGreenTableRow<MyHost>) => (
  <SpawnHostCard host={row.original} />
);

const columns: LGColumnDef<MyHost>[] = [
  {
    header: "Host",
    accessorKey: "id",
    enableSorting: true,
    cell: ({ getValue, row }) => {
      const id = getValue() as string;
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
    accessorKey: "distro.id",
    enableSorting: true,
    cell: ({ getValue }) => <WordBreak>{getValue() as string}</WordBreak>,
  },
  {
    header: "Status",
    accessorKey: "status",
    enableSorting: true,
    cell: ({ getValue }) => (
      <HostStatusBadge status={getValue() as HostStatus} />
    ),
  },
  {
    header: "Expires In",
    // @ts-expect-error: FIXME. This comment was added by an automated script.
    accessorFn: ({ expiration }) => new Date(expiration),
    enableSorting: true,
    cell: ({ getValue, row }) =>
      row.original.noExpiration
        ? DoesNotExpire
        : formatDistanceToNow(getValue() as Date),
  },
  {
    header: "Uptime",
    // @ts-expect-error: FIXME. This comment was added by an automated script.
    accessorFn: ({ uptime }) => new Date(uptime),
    enableSorting: true,
    cell: ({ getValue }) => formatDistanceToNow(getValue() as Date),
  },
  {
    header: "Actions",
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
