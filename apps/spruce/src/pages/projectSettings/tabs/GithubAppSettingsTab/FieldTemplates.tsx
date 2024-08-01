import { useRef } from "react";
import styled from "@emotion/styled";
import { useLeafyGreenTable, LGColumnDef } from "@leafygreen-ui/table";
import { ArrayFieldTemplateProps } from "@rjsf/core";
import { BaseTable } from "components/Table/BaseTable";
import { tableColumnOffset } from "constants/tokens";
import { Unpacked } from "types/utils";

type ArrayItem = Unpacked<ArrayFieldTemplateProps["items"]>;

export const ArrayFieldTemplate: React.FC<
  Pick<ArrayFieldTemplateProps, "items">
> = ({ items }) => {
  const tableContainerRef = useRef<HTMLDivElement>(null);
  const table = useLeafyGreenTable<ArrayItem>({
    columns,
    containerRef: tableContainerRef,
    data: items,
    defaultColumn: {
      enableColumnFilter: false,
    },
  });
  return (
    <BaseTable
      data-cy="github-token-permissions-restrictions-table"
      table={table}
    />
  );
};

const HeaderLabel = styled.span`
  width: 100%;
`;

const columns: LGColumnDef<ArrayItem>[] = [
  {
    header: () => (
      <>
        <HeaderLabel>Requester Type</HeaderLabel>
        <HeaderLabel style={{ marginLeft: tableColumnOffset }}>
          Permission Group
        </HeaderLabel>
      </>
    ),
    accessorKey: "children",
    cell: ({ row }) => row.original.children,
  },
];
