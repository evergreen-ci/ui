import styled from "@emotion/styled";
import Button from "@leafygreen-ui/button";
import { CharKey, ModifierKey } from "@evg-ui/lib/constants/keys";
import { size } from "@evg-ui/lib/constants/tokens";
import { DIRECTION, SearchState } from "context/LogContext/types";
import { useKeyboardShortcut } from "hooks";
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
            data-cy="previous-button"
            onClick={() => paginate(DIRECTION.PREVIOUS)}
            size="small"
          >
            Prev
          </Button>
          <Button
            data-cy="next-button"
            onClick={() => paginate(DIRECTION.NEXT)}
            size="small"
          >
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
