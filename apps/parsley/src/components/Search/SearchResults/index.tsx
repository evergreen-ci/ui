import styled from "@emotion/styled";
import { Button, Size } from "@leafygreen-ui/button";
import { CharKey, ModifierKey } from "@evg-ui/lib/constants/keys";
import { size } from "@evg-ui/lib/constants/tokens";
import { useKeyboardShortcut } from "@evg-ui/lib/hooks/useKeyboardShortcut";
import { DIRECTION, SearchState } from "context/LogContext/types";
import SearchCount from "./SearchCount";

interface SearchResultsProps {
  searchState: SearchState;
  paginate: (dir: DIRECTION) => void;
}

const SearchResults: React.FC<SearchResultsProps> = ({
  paginate,
  searchState,
}) => {
  // Register keyboard shortcuts for paginating backwards.
  useKeyboardShortcut({ charKey: CharKey.P }, () =>
    paginate(DIRECTION.PREVIOUS),
  );
  useKeyboardShortcut(
    { charKey: CharKey.Enter, modifierKeys: [ModifierKey.Shift] },
    () => paginate(DIRECTION.PREVIOUS),
  );

  // Register keyboard shortcuts for paginating forwards.
  useKeyboardShortcut({ charKey: CharKey.N }, () => paginate(DIRECTION.NEXT));
  useKeyboardShortcut({ charKey: CharKey.Enter }, () =>
    paginate(DIRECTION.NEXT),
  );

  return (
    <SearchContainer>
      <SearchCount
        currentSearchIndex={(searchState.searchIndex ?? 0) + 1}
        matchingSearchCount={searchState.searchRange ?? 0}
      />

      {searchState.searchRange !== undefined && (
        <>
          <Button
            onClick={() => paginate(DIRECTION.PREVIOUS)}
            size={Size.Small}
          >
            Prev
          </Button>
          <Button onClick={() => paginate(DIRECTION.NEXT)} size={Size.Small}>
            Next
          </Button>
        </>
      )}
    </SearchContainer>
  );
};

const SearchContainer = styled.div`
  align-items: center;
  display: flex;
  gap: ${size.xs};
`;

export default SearchResults;
