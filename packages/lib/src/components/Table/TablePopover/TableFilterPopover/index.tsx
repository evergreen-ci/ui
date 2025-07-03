import { useState, useRef } from "react";
import styled from "@emotion/styled";
import Checkbox from "@leafygreen-ui/checkbox";
import Icon from "@leafygreen-ui/icon";
import IconButton from "@leafygreen-ui/icon-button";
import { palette } from "@leafygreen-ui/palette";
import Popover, { Align, Justify } from "@leafygreen-ui/popover";
import { size } from "../../../../constants/tokens";
import { useOnClickOutside } from "../../../../hooks";
import { PopoverContainer } from "../../../styles/Popover";
import { TreeDataEntry } from "../../BaseTable";
import { DEFAULT_SPACING, FilterWrapper } from "../constants";

const { blue, gray } = palette;

interface TableFilterPopoverProps {
  "data-cy"?: string;
  onConfirm: (filters: string[]) => void;
  options?: TreeDataEntry[];
  value: string[];
}

const TableFilterPopover: React.FC<TableFilterPopoverProps> = ({
  "data-cy": dataCy,
  onConfirm,
  options = [],
  value,
}) => {
  const [active, setActive] = useState(false);
  const hasFilters = value.length > 0;
  const iconColor = hasFilters ? blue.base : gray.dark2;

  const buttonRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  // Handle onClickOutside
  useOnClickOutside([buttonRef, popoverRef], () => setActive(false));

  const handleCheckboxChange = (optionValue: string, checked: boolean) => {
    let newFilters: string[];
    if (checked) {
      newFilters = [...value, optionValue];
    } else {
      newFilters = value.filter((v) => v !== optionValue);
    }
    onConfirm(newFilters);
  };

  return (
    <FilterWrapper>
      <IconButton
        ref={buttonRef}
        active={active}
        aria-label="Table Filter Popover Icon"
        data-cy={dataCy}
        data-highlighted={hasFilters}
        onClick={() => setActive(!active)}
      >
        <Icon color={iconColor} glyph="Filter" small="xsmall" />
      </IconButton>
      <Popover
        active={active}
        align={Align.Bottom}
        justify={Justify.Middle}
        refEl={buttonRef}
        spacing={DEFAULT_SPACING}
      >
        <PopoverContainer ref={popoverRef} data-cy={`${dataCy}-wrapper`}>
          {options.length === 0 ? (
            <NoFiltersMessage>No filters available.</NoFiltersMessage>
          ) : (
            <FilterContainer>
              {options.map((option) => (
                <Checkbox
                  key={option.value}
                  checked={value.includes(option.value)}
                  label={option.title}
                  onChange={(e) =>
                    handleCheckboxChange(option.value, e.target.checked)
                  }
                />
              ))}
            </FilterContainer>
          )}
        </PopoverContainer>
      </Popover>
    </FilterWrapper>
  );
};

export default TableFilterPopover;

const NoFiltersMessage = styled.div`
  padding: ${size.xs};
  color: ${gray.dark1};
  font-style: italic;
`;

const FilterContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${size.xxs};
  padding: ${size.xs};
  min-width: 200px;
`;
