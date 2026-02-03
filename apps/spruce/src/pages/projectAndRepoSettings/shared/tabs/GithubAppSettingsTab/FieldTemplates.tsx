import styled from "@emotion/styled";
import { ArrayFieldTemplateProps } from "@rjsf/core";
import {
  useLeafyGreenTable,
  LGColumnDef,
  BaseTable,
} from "@evg-ui/lib/components";
import { Unpacked } from "@evg-ui/lib/types";
import { tableColumnOffset } from "constants/tokens";

type ArrayItem = Unpacked<ArrayFieldTemplateProps["items"]>;

export const ArrayFieldTemplate: React.FC<
  Pick<ArrayFieldTemplateProps, "items">
> = ({ items }) => {
  const table = useLeafyGreenTable<ArrayItem>({
    columns,
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
