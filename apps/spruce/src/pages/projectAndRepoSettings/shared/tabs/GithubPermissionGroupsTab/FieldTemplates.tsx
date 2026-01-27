import { useMemo } from "react";
import styled from "@emotion/styled";
import { Button, Size as ButtonSize } from "@leafygreen-ui/button";
import { Body } from "@leafygreen-ui/typography";
import { ArrayFieldTemplateProps } from "@rjsf/core";
import Icon from "@evg-ui/lib/components/Icon";
import {
  useLeafyGreenTable,
  LGColumnDef,
  BaseTable,
} from "@evg-ui/lib/components/Table";
import { size } from "@evg-ui/lib/constants/tokens";
import { Unpacked } from "@evg-ui/lib/types/utils";
import { PlusButton } from "components/Buttons";
import { tableColumnOffset } from "constants/tokens";

type ArrayItem = Unpacked<ArrayFieldTemplateProps["items"]>;

export const ArrayFieldTemplate: React.FC<
  Pick<
    ArrayFieldTemplateProps,
    "items" | "onAddClick" | "disabled" | "readonly"
  >
> = ({ disabled, items, onAddClick, readonly }) => {
  const isDisabled = readonly || disabled;
  const columns = useMemo(() => getColumns(isDisabled), [isDisabled]);
  const table = useLeafyGreenTable<ArrayItem>({
    columns,
    data: items,
    defaultColumn: {
      enableColumnFilter: false,
    },
  });

  return (
    <>
      <BaseTable
        data-cy="github-permissions-table"
        emptyComponent={
          <Body style={{ marginLeft: tableColumnOffset, marginTop: size.xs }}>
            No permission groups added yet.
          </Body>
        }
        table={table}
      />
      <ButtonWrapper>
        <PlusButton
          data-cy="add-permission-button"
          disabled={isDisabled}
          onClick={onAddClick}
          size={ButtonSize.Small}
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

const getColumns = (disabled: boolean): LGColumnDef<ArrayItem>[] => [
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
        data-cy="delete-permission-button"
        disabled={disabled}
        leftGlyph={<Icon glyph="Trash" />}
        onClick={row.original.onDropIndexClick(row.index)}
        size={ButtonSize.Small}
      />
    ),
    size: 10,
  },
];
