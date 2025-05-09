import { useEffect, useMemo, useState } from "react";
import styled from "@emotion/styled";
import TextInput from "@leafygreen-ui/text-input";
import debounce from "lodash.debounce";
import { size } from "@evg-ui/lib/constants/tokens";
import { filterInputDebounceTimeout } from "constants/timeouts";
import { useQueryParam } from "hooks/useQueryParam";
import { TaskHistoryOptions } from "../types";

interface Props {
  numMatchingResults: number;
}
export const TestFailureSearchInput: React.FC<Props> = ({
  numMatchingResults,
}) => {
  const [failingTest, setFailingTest] = useQueryParam<string>(
    TaskHistoryOptions.FailingTest,
    "",
  );

  const [searchTerm, setSearchTerm] = useState(failingTest);
  const updateQueryParamWithDebounce = useMemo(
    () =>
      debounce(
        (str) => setFailingTest(str ? str : undefined),
        filterInputDebounceTimeout,
      ),
    [setFailingTest],
  );
  useEffect(() => {
    if (searchTerm !== failingTest) {
      updateQueryParamWithDebounce(searchTerm);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm]);

  return (
    <>
      <StyledInput
        aria-label="Search Test Failure Input"
        data-cy="search-test-failures-input"
        label="Search Test Failures"
        onChange={(e) => {
          setSearchTerm(e.target.value);
        }}
        placeholder="Search failed test"
        value={searchTerm}
      />
      {numMatchingResults === 0 && failingTest && (
        <NoMatches>No results on this page</NoMatches>
      )}
    </>
  );
};

const StyledInput = styled(TextInput)`
  /* Account for chrome blue focus outline */
  margin: 0 ${size.xxs};
  flex: 1;
`;

const NoMatches = styled.div`
  margin-left: ${size.xxs};
`;
