import { useEffect, useRef, useState } from "react";
import { Button } from "@via-ds/components/button";
import { Popover, PopoverRoot } from "@via-ds/components/popover";
import { SearchField } from "@via-ds/components/search-field";
import MagnifyingGlass from "@via-ds/icons/MagnifyingGlass";
import { useOnClickOutside } from "../../../../hooks";
import { PopoverContainer } from "../../../styles/Popover";
import { FilterWrapper } from "../constants";
import constantStyles from "../constants.module.css";
import styles from "./index.module.css";

interface TableSearchPopoverProps {
  "data-testid"?: string;
  onConfirm: (search: string) => void;
  placeholder?: string;
  value: string;
}

const TableSearchPopover: React.FC<TableSearchPopoverProps> = ({
  "data-testid": dataTestId,
  onConfirm,
  placeholder = "Search",
  value,
}) => {
  const [input, setInput] = useState(value);
  const [active, setActive] = useState(false);
  const [inputRef, setInputRef] = useState<HTMLInputElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  useOnClickOutside([buttonRef, popoverRef], () => setActive(false));

  useEffect(() => {
    inputRef?.focus();
    inputRef?.select();
  }, [inputRef]);

  const onOpenChange = (isOpen: boolean) => {
    setInput(value);
    setActive(isOpen);
  };

  return (
    <FilterWrapper>
      <PopoverRoot
        isNonModal
        isOpen={active}
        onOpenChange={onOpenChange}
        triggerType="dialog"
      >
        <Button
          ref={buttonRef}
          aria-label="Table Search Popover Icon"
          data-testid={dataTestId}
          size="small"
          variant="tertiary"
        >
          <MagnifyingGlass
            className={
              value === ""
                ? constantStyles.inactiveIcon
                : constantStyles.activeIcon
            }
          />
        </Button>
        <Popover>
          <PopoverContainer
            ref={popoverRef}
            data-testid={`${dataTestId}-wrapper`}
          >
            <SearchField
              ref={setInputRef}
              aria-label="Search table"
              className={styles.searchField}
              data-testid={`${dataTestId}-input-filter`}
              description="Press enter to filter."
              onChange={setInput}
              onSubmit={(search) => {
                onConfirm(search);
                setActive(false);
              }}
              placeholder={placeholder}
              value={input}
            />
          </PopoverContainer>
        </Popover>
      </PopoverRoot>
    </FilterWrapper>
  );
};

export default TableSearchPopover;
