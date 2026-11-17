import { useRef, useState } from "react";
import { Button } from "@via-ds/components/button";
import { Popover, PopoverRoot } from "@via-ds/components/popover";
import { Body } from "@via-ds/components/typography";
import Filter from "@via-ds/icons/Filter";
import { useOnClickOutside } from "../../../../hooks";
import { PopoverContainer } from "../../../styles/Popover";
import { TreeDataEntry, TreeSelect } from "../../../TreeSelect";
import { FilterWrapper } from "../constants";
import styles from "../constants.module.css";

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

  const buttonRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  useOnClickOutside([buttonRef, popoverRef], () => setActive(false));

  return (
    <FilterWrapper>
      <PopoverRoot
        isNonModal
        isOpen={active}
        onOpenChange={setActive}
        triggerType="dialog"
      >
        <Button
          ref={buttonRef}
          aria-label="Table Filter Popover Icon"
          data-highlighted={hasFilters}
          data-testid={dataTestId}
          variant="tertiary"
        >
          <Filter
            className={hasFilters ? styles.activeIcon : styles.inactiveIcon}
          />
        </Button>
        <Popover>
          <PopoverContainer
            ref={popoverRef}
            data-testid={`${dataTestId}-wrapper`}
          >
            {options.length > 0 ? (
              <TreeSelect onChange={onConfirm} state={value} tData={options} />
            ) : (
              <Body>No filters available.</Body>
            )}
          </PopoverContainer>
        </Popover>
      </PopoverRoot>
    </FilterWrapper>
  );
};

export default TableFilterPopover;
