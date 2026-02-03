import { useEffect, useRef, useState } from "react";
import styled from "@emotion/styled";
import { Card } from "@leafygreen-ui/card";
import { IconButton } from "@leafygreen-ui/icon-button";
import { palette } from "@leafygreen-ui/palette";
import { Popover } from "@leafygreen-ui/popover";
import { Body, Overline } from "@leafygreen-ui/typography";
import Icon from "@evg-ui/lib/components/Icon";
import { CharKey } from "@evg-ui/lib/constants/keys";
import { size } from "@evg-ui/lib/constants/tokens";
import { useOnClickOutside } from "@evg-ui/lib/hooks/useOnClickOutside";
import { SearchSuggestionGroup } from "./types";

const { blue, gray } = palette;

interface SearchPopoverProps {
  disabled?: boolean;
  searchSuggestions: SearchSuggestionGroup[];
  onClick?: (suggestion: string) => void;
}

const SearchPopover: React.FC<SearchPopoverProps> = ({
  disabled = false,
  onClick,
  searchSuggestions,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  // Flatten suggestions for keyboard navigation
  const flattenedSuggestions = searchSuggestions.flatMap(
    (group) => group.suggestions,
  );
  const totalSuggestions = flattenedSuggestions.length;

  useOnClickOutside([buttonRef, popoverRef], () => {
    setIsOpen(false);
    setSelectedIndex(-1);
  });

  useEffect(() => {
    if (isOpen && popoverRef.current) {
      popoverRef.current.focus();
    }
  }, [isOpen]);

  const handleClick = (suggestion: string) => {
    setIsOpen(false);
    setSelectedIndex(-1);
    onClick?.(suggestion);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || totalSuggestions === 0) return;

    if (e.key === CharKey.ArrowUp) {
      e.preventDefault();
      setSelectedIndex((prevIndex) =>
        prevIndex <= 0 ? totalSuggestions - 1 : prevIndex - 1,
      );
    } else if (e.key === CharKey.ArrowDown) {
      e.preventDefault();
      setSelectedIndex((prevIndex) =>
        prevIndex === totalSuggestions - 1 ? 0 : prevIndex + 1,
      );
    } else if (e.key === CharKey.Enter && selectedIndex >= 0) {
      e.preventDefault();
      handleClick(flattenedSuggestions[selectedIndex]);
    }
  };

  // Helper function to get the global index of a suggestion within a group
  const getGlobalIndex = (
    groupIndex: number,
    suggestionIndex: number,
  ): number => {
    let globalIndex = 0;
    for (let i = 0; i < groupIndex; i++) {
      globalIndex += searchSuggestions[i].suggestions.length;
    }
    return globalIndex + suggestionIndex;
  };

  return (
    <>
      <IconButton
        ref={buttonRef}
        aria-labelledby="View search suggestions"
        data-cy="search-suggestion-button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        title="View search suggestions"
      >
        <>
          <Icon fill={gray.base} glyph="Bulb" />
          <Icon fill={gray.base} glyph="CaretDown" />
        </>
      </IconButton>
      <Popover active={isOpen} data-cy="search-suggestion-popover">
        <div
          ref={popoverRef}
          aria-label="Search suggestions"
          onKeyDown={handleKeyDown}
          role="menu"
          tabIndex={0}
        >
          <StyledCard>
            <Scrollable>
              {searchSuggestions.length > 0 ? (
                searchSuggestions.map((group, groupIndex) => (
                  <GroupContainer key={group.title}>
                    <Title>{group.title}</Title>
                    <Divider />
                    {group.suggestions.map((suggestion, suggestionIndex) => {
                      const globalIndex = getGlobalIndex(
                        groupIndex,
                        suggestionIndex,
                      );
                      return (
                        <SearchSuggestion
                          key={`${group.title}-${suggestion}`}
                          $isSelected={globalIndex === selectedIndex}
                          onClick={() => handleClick(suggestion)}
                          role="menuitem"
                        >
                          {suggestion}
                        </SearchSuggestion>
                      );
                    })}
                  </GroupContainer>
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

const Title = styled(Overline)`
  padding-top: ${size.xs};
  padding-left: ${size.s};
`;

const StyledBody = styled(Body)`
  padding: ${size.s};
  display: flex;
  justify-content: center;
`;

const Divider = styled.hr`
  border: 0;
  border-bottom: 1px solid ${gray.light2};
  margin: ${size.xxs} 0;
`;

const GroupContainer = styled.div`
  display: flex;
  flex-direction: column;
  &:not(:last-child) {
    border-bottom: 1px solid ${gray.light2};
  }
`;

const SearchSuggestion = styled.button<{ $isSelected?: boolean }>`
  // Remove native button styles.
  border: 0;
  background: none;
  text-align: inherit;
  font: inherit;

  padding: ${size.xs} ${size.s};
  word-break: break-all;
  ${({ $isSelected }) =>
    $isSelected
      ? `background-color: ${blue.light3};`
      : `&:hover, &:focus { 
      cursor: pointer;
      outline: none;
      background-color: ${blue.light3}; 
    }`}
`;

export default SearchPopover;
