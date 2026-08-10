import { palette } from "@leafygreen-ui/palette";
import { Body } from "@leafygreen-ui/typography";
import { styled } from "@linaria/react";
import { size } from "@evg-ui/lib/constants/tokens";

interface SearchCountProps {
  matchingSearchCount: number;
  currentSearchIndex?: number;
}
const SearchCount: React.FC<SearchCountProps> = ({
  currentSearchIndex,
  matchingSearchCount,
}) => (
  <StyledBody data-testid="search-count">
    {matchingSearchCount !== 0
      ? `${currentSearchIndex}/${matchingSearchCount}`
      : "No Matches"}
  </StyledBody>
);

// Linaria's styled() cannot infer props from LeafyGreen's polymorphic components,
// so Body is narrowed to its default rendered element.
const StyledBody = styled(
  Body as React.FC<React.ComponentPropsWithoutRef<"p">>,
)`
  margin-left: ${size.xs};
  color: ${palette.black};
`;

export default SearchCount;
