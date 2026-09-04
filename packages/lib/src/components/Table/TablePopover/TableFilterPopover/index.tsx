import { useRef, useState } from "react";
import { IconButton } from "@leafygreen-ui/icon-button";
import { palette } from "@leafygreen-ui/palette";
import { Align, Justify, Popover } from "@leafygreen-ui/popover";
import { Body } from "@leafygreen-ui/typography";
import { useOnClickOutside } from "../../../../hooks";
import { Icon } from "../../../Icon";
import { PopoverContainer } from "../../../styles/Popover";
import { TreeDataEntry, TreeSelect } from "../../../TreeSelect";
import { DEFAULT_SPACING, FilterWrapper } from "../constants";

const { blue, gray } = palette;

interface TableFilterPopoverProps {
  "data-testid"?: string;
  onConfirm: (filters: string[]) => void;
  options: TreeDataEntry[];
  value: string[];
}

const TableFilterPopover: React.FC<TableFilterPopoverProps> = ({
  "data-testid": dataTestId,
  onConfirm,
  options,
  value,
}) => {
  const [active, setActive] = useState(false);
  const hasFilters = value.length > 0;
  const iconColor = hasFilters ? blue.base : gray.dark2;

  const buttonRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  // Handle onClickOutside
  useOnClickOutside([buttonRef, popoverRef], () => setActive(false));

  const onChange = (newFilters: string[]) => {
    onConfirm(newFilters);
  };

  return (
    <FilterWrapper>
      <IconButton
        ref={buttonRef}
        active={active}
        aria-label="Table Filter Popover Icon"
        data-highlighted={hasFilters}
        data-testid={dataTestId}
        onClick={() => setActive(!active)}
      >
        <Icon fill={iconColor} glyph="Filter" />
      </IconButton>
      <Popover
        active={active}
        align={Align.Bottom}
        justify={Justify.Middle}
        refEl={buttonRef}
        spacing={DEFAULT_SPACING}
      >
        <PopoverContainer
          ref={popoverRef}
          data-testid={`${dataTestId}-wrapper`}
        >
          {options.length > 0 ? (
            <TreeSelect onChange={onChange} state={value} tData={options} />
          ) : (
            <Body>No filters available.</Body>
          )}
        </PopoverContainer>
      </Popover>
    </FilterWrapper>
  );
};

export default TableFilterPopover;
