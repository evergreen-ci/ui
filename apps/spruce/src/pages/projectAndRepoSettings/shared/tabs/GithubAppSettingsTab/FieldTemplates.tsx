import styled from "@emotion/styled";
import {
  ArrayFieldItemTemplateProps,
  ArrayFieldTemplateProps,
} from "@rjsf/utils";
import {
  BaseTable,
  LGColumnDef,
  useLeafyGreenTable,
} from "@evg-ui/lib/components/Table";
import { tableColumnOffset } from "constants/tokens";

type ArrayItem = ArrayFieldTemplateProps["items"][number];

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
      data-testid="github-token-permissions-restrictions-table"
      table={table}
    />
  );
};

const HeaderLabel = styled.span`
  width: 100%;
`;

const columns: LGColumnDef<ArrayItem>[] = [
  {
    id: "fields",
    header: () => (
      <>
        <HeaderLabel>Requester Type</HeaderLabel>
        <HeaderLabel style={{ marginLeft: tableColumnOffset }}>
          Permission Group
        </HeaderLabel>
      </>
    ),
    cell: ({ row }) => row.original as ArrayItem,
  },
];

export const ArrayFieldItemTemplate: React.FC<ArrayFieldItemTemplateProps> = ({
  children,
}) => children;
