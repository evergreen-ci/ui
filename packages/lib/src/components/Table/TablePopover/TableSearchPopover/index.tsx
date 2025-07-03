import { useState, useEffect, useRef } from "react";
import styled from "@emotion/styled";
import Icon from "@leafygreen-ui/icon";
import IconButton from "@leafygreen-ui/icon-button";
import { palette } from "@leafygreen-ui/palette";
import Popover, { Align, Justify } from "@leafygreen-ui/popover";
import { Description } from "@leafygreen-ui/typography";
import { size } from "../../../../constants/tokens";
import { useOnClickOutside } from "../../../../hooks";
import { PopoverContainer } from "../../../styles/Popover";
import { DEFAULT_SPACING, FilterWrapper } from "../constants";

const { blue, gray } = palette;

interface TableSearchPopoverProps {
  "data-cy"?: string;
  onConfirm: (search: string) => void;
  placeholder?: string;
  value: string;
}

const TableSearchPopover: React.FC<TableSearchPopoverProps> = ({
  "data-cy": dataCy,
  onConfirm,
  placeholder = "Search",
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
      <IconButton
        ref={buttonRef}
        active={active}
        aria-label="Table Search Popover Icon"
        data-cy={dataCy}
        onClick={() => setActive(!active)}
      >
        <Icon color={iconColor} glyph="MagnifyingGlass" small="xsmall" />
      </IconButton>
      <Popover
        active={active}
        align={Align.Bottom}
        justify={Justify.Middle}
        refEl={buttonRef}
        spacing={DEFAULT_SPACING}
      >
        <PopoverContainer ref={popoverRef} data-cy={`${dataCy}-wrapper`}>
          <InputContainer>
            <Description>Press enter to filter.</Description>
            <input
              ref={(el) => setInputRef(el)}
              aria-label="Search table"
              aria-labelledby="search-input-label"
              data-cy={`${dataCy}-input-filter`}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && onEnter()}
              placeholder={placeholder}
              style={{
                padding: "8px 12px",
                border: "1px solid #ccc",
                borderRadius: "4px",
                fontSize: "14px",
                width: "100%",
              }}
              value={input}
            />
          </InputContainer>
        </PopoverContainer>
      </Popover>
    </FilterWrapper>
  );
};

export default TableSearchPopover;

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${size.xxs};
  min-width: 200px;
  * {
    box-sizing: content-box;
  }
`;
