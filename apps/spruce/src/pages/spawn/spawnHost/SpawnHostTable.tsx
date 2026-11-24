import { useEffect, useState } from "react";
import styled from "@emotion/styled";
import { Badge } from "@leafygreen-ui/badge";
import { useAppLayout } from "@via-ds/components/app-layout";
import { BottomPanelCloseButton } from "@via-ds/components/bottom-panel";
import { Content, Header } from "@via-ds/components/structure";
import {
  TABLE_DETAILS_PANEL_KEY,
  type TableDetailsRenderProps,
  TableSlot,
  useTableDetails,
} from "@via-ds/components/table";
import { ToggleButton } from "@via-ds/components/toggle-button";
import { Text, TextStyle } from "@via-ds/components/typography";
import Note from "@via-ds/icons/Note";
import { formatDistanceToNow } from "date-fns";
import { WordBreak } from "@evg-ui/lib/components/styles";
import {
  ViaBaseTable,
  ViaColumnDef,
  useTable,
} from "@evg-ui/lib/components/Table";
import { size } from "@evg-ui/lib/constants/tokens";
import { useQueryParam } from "@evg-ui/lib/hooks";
import HostStatusBadge from "components/HostStatusBadge";
import { DoesNotExpire } from "components/Spawn";
import { HostStatus } from "types/host";
import { MyHost, QueryParams } from "types/spawn";
import SpawnHostCard from "./SpawnHostCard";
import styles from "./SpawnHostTable.module.css";
import { SpawnHostTableActions } from "./SpawnHostTableActions";

interface SpawnHostTableProps {
  hosts: MyHost[];
}

export const SpawnHostTable: React.FC<SpawnHostTableProps> = ({ hosts }) => {
  const [selectedHost] = useQueryParam(QueryParams.Host, "");
  const { setSelectedBottomPanelKey } = useAppLayout();

  const [initialOpenRowIds] = useState(() =>
    hosts.some(({ id }) => id === selectedHost) ? [selectedHost] : [],
  );

  useEffect(() => {
    if (initialOpenRowIds.length) {
      setSelectedBottomPanelKey(TABLE_DETAILS_PANEL_KEY);
    }
  }, [initialOpenRowIds, setSelectedBottomPanelKey]);

  const table = useTable<MyHost>({
    columns,
    data: hosts,
    defaultColumn: {
      enableColumnFilter: false,
      enableSorting: false,
      // Handle bug in sorting order
      // https://github.com/TanStack/table/issues/4289
      sortDescFirst: false,
    },
    getRowId: ({ id }) => id,
  });

  useTableDetails(table, {
    id: "spawn-hosts",
    defaultOpenRowIds: initialOpenRowIds,
    getRowLabel: ({ original }) => getHostName(original),
    render: renderHostDetails,
  });

  return (
    <ViaBaseTable
      data-testid="spawn-host-table"
      shouldAlternateRowColor
      table={table}
    />
  );
};

const renderHostDetails = ({
  clear,
  hiddenCount,
  rows,
}: TableDetailsRenderProps<MyHost>) => (
  <>
    <Header>
      <Text slot="title">Host details</Text>
      {hiddenCount > 0 && <Text>+{hiddenCount} not shown</Text>}
      <BottomPanelCloseButton aria-label="Close details" onPress={clear} />
    </Header>
    <Content isScrollable>
      <div className={styles.details}>
        {rows.map(({ id, original }) => (
          <section key={id} aria-label={getHostName(original)}>
            <Text elementType="h3" textStyle={TextStyle.heading6}>
              {getHostName(original)}
            </Text>
            <SpawnHostCard host={original} />
          </section>
        ))}
      </div>
    </Content>
  </>
);

const getHostName = ({ displayName, id }: MyHost) => displayName || id;

const columns: ViaColumnDef<MyHost>[] = [
  {
    header: "Host",
    accessorKey: "id",
    enableSorting: true,
    cell: ({ row }) =>
      row.original.distro?.isVirtualWorkStation ? (
        <FlexContainer>
          <NoWrap>{getHostName(row.original)}</NoWrap>
          <Badge>Workstation</Badge>
        </FlexContainer>
      ) : (
        <WordBreak>{getHostName(row.original)}</WordBreak>
      ),
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
  {
    id: "details",
    header: "Details",
    cell: () => (
      <ToggleButton slot={TableSlot.PanelToggle}>
        <Note slot="icon" />
      </ToggleButton>
    ),
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
