import { useMemo } from "react";
import styled from "@emotion/styled";
import { Button, Size as ButtonSize } from "@leafygreen-ui/button";
import { Body } from "@leafygreen-ui/typography";
import {
  ArrayFieldItemTemplateProps,
  ArrayFieldTemplateProps,
} from "@rjsf/utils";
import Icon from "@evg-ui/lib/components/Icon";
import {
  BaseTable,
  LGColumnDef,
  useLeafyGreenTable,
} from "@evg-ui/lib/components/Table";
import { size } from "@evg-ui/lib/constants/tokens";
import { PlusButton } from "components/Buttons";
import { tableColumnOffset } from "constants/tokens";

type ArrayItem = ArrayFieldTemplateProps["items"][number];

export const ArrayFieldTemplate: React.FC<
  Pick<
    ArrayFieldTemplateProps,
    "items" | "onAddClick" | "disabled" | "readonly"
  >
> = ({ disabled, items, onAddClick, readonly }) => {
  const isDisabled = readonly || disabled;
  const columns = useMemo(() => getColumns(), []);
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
        data-testid="github-permissions-table"
        emptyComponent={
          <Body style={{ marginLeft: tableColumnOffset, marginTop: size.xs }}>
            No permission groups added yet.
          </Body>
        }
        table={table}
      />
      <ButtonWrapper>
        <PlusButton
          data-testid="add-permission-button"
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

const getColumns = (): LGColumnDef<ArrayItem>[] => [
  {
    id: "fields",
    header: () => (
      <>
        <HeaderLabel>Permission Type</HeaderLabel>
        <HeaderLabel style={{ marginLeft: tableColumnOffset }}>
          Permission Value
        </HeaderLabel>
      </>
    ),
    cell: ({ row }) => row.original as ArrayItem,
  },
];

export const ArrayFieldItemTemplate: React.FC<ArrayFieldItemTemplateProps> = ({
  buttonsProps,
  children,
  disabled,
  readonly,
}) => (
  <>
    {children}
    {buttonsProps.hasRemove && (
      <Button
        data-testid="delete-permission-button"
        disabled={disabled || readonly}
        leftGlyph={<Icon glyph="Trash" />}
        onClick={buttonsProps.onRemoveItem}
        size={ButtonSize.Small}
      />
    )}
  </>
);
