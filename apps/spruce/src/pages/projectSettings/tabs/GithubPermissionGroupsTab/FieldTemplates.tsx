import { useRef } from "react";
import styled from "@emotion/styled";
import Button from "@leafygreen-ui/button";
import { useLeafyGreenTable, LGColumnDef } from "@leafygreen-ui/table";
import { Body } from "@leafygreen-ui/typography";
import { ArrayFieldTemplateProps } from "@rjsf/core";
import { PlusButton } from "components/Buttons";
import Icon from "components/Icon";
import { BaseTable } from "components/Table/BaseTable";
import { size, tableColumnOffset } from "constants/tokens";
import { Unpacked } from "types/utils";

type ArrayItem = Unpacked<ArrayFieldTemplateProps["items"]>;

export const ArrayFieldTemplate: React.FC<
  Pick<ArrayFieldTemplateProps, "items" | "onAddClick">
> = ({ items, onAddClick }) => {
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
    <>
      <BaseTable
        data-cy="github-permissions-table"
        table={table}
        emptyComponent={
          <Body style={{ marginLeft: tableColumnOffset }}>
            No permission groups added yet.
          </Body>
        }
      />
      <ButtonWrapper>
        <PlusButton
          data-cy="add-permission-button"
          onClick={onAddClick}
          size="small"
        >
          Add permission
        </PlusButton>
      </ButtonWrapper>
    </>
  );
};

const ButtonWrapper = styled.div`
  margin-top: ${size.s};
`;

const HeaderLabel = styled.span`
  width: 100%;
`;

const columns: LGColumnDef<ArrayItem>[] = [
  {
    header: () => (
      <>
        <HeaderLabel>Permission Type</HeaderLabel>
        <HeaderLabel style={{ marginLeft: tableColumnOffset }}>
          Permission Value
        </HeaderLabel>
      </>
    ),
    accessorKey: "children",
    cell: ({ row }) => row.original.children,
  },
  {
    header: "Action",
    cell: ({ row }) => (
      <Button
        onClick={row.original.onDropIndexClick(row.index)}
        leftGlyph={<Icon glyph="Trash" />}
        data-cy="delete-permission-button"
        size="small"
      />
    ),
    size: 10,
  },
];
