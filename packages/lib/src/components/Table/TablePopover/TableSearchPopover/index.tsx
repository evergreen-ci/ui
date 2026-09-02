import { useEffect, useRef, useState } from "react";
import { IconButton } from "@leafygreen-ui/icon-button";
import { palette } from "@leafygreen-ui/palette";
import { Align, Justify, Popover } from "@leafygreen-ui/popover";
import {
  SearchInput,
  Size as SearchInputSize,
} from "@leafygreen-ui/search-input";
import { Description } from "@leafygreen-ui/typography";
import { useOnClickOutside } from "../../../../hooks";
import { Icon } from "../../../Icon";
import { PopoverContainer } from "../../../styles/Popover";
import { DEFAULT_SPACING, FilterWrapper } from "../constants";
import styles from "./index.module.css";

const { blue, gray } = palette;

interface TableSearchPopoverProps {
  "data-testid"?: string;
  onConfirm: (search: string) => void;
  placeholder?: string;
  value: string;
}

const TableSearchPopover: React.FC<TableSearchPopoverProps> = ({
  "data-testid": dataTestId,
  onConfirm,
  placeholder,
  value,
}) => {
  const [input, setInput] = useState(value);
  const [active, setActive] = useState(false);
  const iconColor = value === "" ? gray.dark2 : blue.base;

  const [inputRef, setInputRef] = useState<HTMLInputElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  // Handle onClickOutside
  useOnClickOutside([buttonRef, popoverRef], () => setActive(false));

  // If the value from the props has changed, update the input.
  useEffect(() => {
    setInput(value);
  }, [value]);

  const onEnter = () => {
    onConfirm(input);
    setActive(false);
  };

  useEffect(() => {
    inputRef?.focus();
    inputRef?.select();
  }, [inputRef]);

  return (
    <FilterWrapper>
      {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
      {/* @ts-ignore: LeafyGreen component throws JSX errors */}
      <IconButton
        ref={buttonRef}
        active={active}
        aria-label="Table Search Popover Icon"
        data-testid={dataTestId}
        onClick={() => setActive(!active)}
      >
        <Icon fill={iconColor} glyph="MagnifyingGlass" />
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
          <div className={styles.inputContainer}>
            <Description>Press enter to filter.</Description>
            <SearchInput
              ref={(el) => setInputRef(el)}
              aria-label="Search table"
              data-testid={`${dataTestId}-input-filter`}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && onEnter()}
              placeholder={placeholder}
              size={SearchInputSize.Small}
              value={input}
            />
          </div>
        </PopoverContainer>
      </Popover>
    </FilterWrapper>
  );
};

export default TableSearchPopover;
