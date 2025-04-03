import { KeyboardEvent, useRef, useState } from "react";
import styled from "@emotion/styled";
import Card from "@leafygreen-ui/card";
import IconButton from "@leafygreen-ui/icon-button";
import { palette } from "@leafygreen-ui/palette";
import Popover from "@leafygreen-ui/popover";
import {
  Body,
  BodyProps,
  Overline,
  OverlineProps,
} from "@leafygreen-ui/typography";
import Icon from "@evg-ui/lib/components/Icon";
import { size, zIndex } from "@evg-ui/lib/constants/tokens";
import { useOnClickOutside } from "hooks";

const { blue, gray } = palette;

interface SearchPopoverProps {
  disabled?: boolean;
  searchSuggestions: string[];
  onClick?: (suggestion: string) => void;
  /** Ref forwarded from parent component to handle keyboard events */
  forwardedRef?: React.RefObject<HTMLDivElement>;
  /** Used only for testing keyboard navigation */
  _testSelectedIndex?: number;
  /** Used only for testing keyboard navigation */
  _testSetSelectedIndex?: React.Dispatch<React.SetStateAction<number>>;
}

const SearchPopover: React.FC<SearchPopoverProps> = ({
  disabled = false,
  forwardedRef,
  onClick,
  searchSuggestions,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  useOnClickOutside([buttonRef, popoverRef], () => {
    setIsOpen(false);
    setSelectedIndex(-1);
  });

  const handleClick = (suggestion: string) => {
    setIsOpen(false);
    setSelectedIndex(-1);
    onClick?.(suggestion);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (!isOpen || searchSuggestions.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prevIndex) =>
        prevIndex === searchSuggestions.length - 1 ? 0 : prevIndex + 1,
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prevIndex) =>
        prevIndex <= 0 ? searchSuggestions.length - 1 : prevIndex - 1,
      );
    } else if (e.key === "Enter" && selectedIndex >= 0) {
      e.preventDefault();
      handleClick(searchSuggestions[selectedIndex]);
    }
  };

  return (
    <>
      <IconButton
        ref={buttonRef}
        aria-labelledby="View search suggestions"
        data-cy="search-suggestion-button"
        disabled={disabled}
        onClick={() => {
          setIsOpen(!isOpen);
          setSelectedIndex(-1);
        }}
        title="View search suggestions"
      >
        <>
          <Icon fill={gray.base} glyph="Bulb" />
          <Icon fill={gray.base} glyph="CaretDown" />
        </>
      </IconButton>
      <Popover
        active={isOpen}
        data-cy="search-suggestion-popover"
        popoverZIndex={zIndex.popover}
        usePortal={false}
      >
        <div
          ref={forwardedRef || popoverRef}
          onKeyDown={handleKeyDown}
          role="menu"
          tabIndex={-1}
        >
          <StyledCard>
            <Title>Search suggestions</Title>
            <Divider />
            <Scrollable>
              {searchSuggestions.length > 0 ? (
                searchSuggestions.map((s, index) => (
                  <SearchSuggestion
                    key={s}
                    $isSelected={selectedIndex === index}
                    data-selected={selectedIndex === index}
                    onClick={() => handleClick(s)}
                  >
                    {s}
                  </SearchSuggestion>
                ))
              ) : (
                <StyledBody>
                  No suggestions available for this project.
                </StyledBody>
              )}
            </Scrollable>
          </StyledCard>
        </div>
      </Popover>
    </>
  );
};

const StyledCard = styled(Card)`
  text-align: left;
  overflow: hidden;
  border-radius: ${size.s};
  padding: 0;
`;

const Scrollable = styled.div`
  display: flex;
  flex-direction: column;
  width: 400px;
  max-height: 400px;
  overflow-y: scroll;
`;

const Title = styled(Overline)<OverlineProps>`
  padding-top: ${size.xs};
  padding-left: ${size.s};
`;

const StyledBody = styled(Body)<BodyProps>`
  padding-left: ${size.s};
`;

const Divider = styled.hr`
  border: 0;
  border-bottom: 1px solid ${gray.light2};
  margin: ${size.xxs} 0;
`;

interface SearchSuggestionProps {
  $isSelected?: boolean;
}

const SearchSuggestion = styled.button<SearchSuggestionProps>`
  // Remove native button styles.
  border: 0;
  background: none;
  text-align: inherit;
  font: inherit;

  padding: ${size.xs} ${size.s};
  word-break: break-all;
  cursor: pointer;
  outline: none;

  ${({ $isSelected }) =>
    $isSelected
      ? `background-color: ${blue.light3};`
      : `&:hover, &:focus { background-color: ${blue.light3}; }`}
`;

export default SearchPopover;
