import { useEffect, useMemo, useState } from "react";
import styled from "@emotion/styled";
import {
  SearchInput,
  Size as SearchInputSize,
} from "@leafygreen-ui/search-input";
import debounce from "lodash.debounce";
import { size } from "@evg-ui/lib/constants";
import { useQueryParam } from "@evg-ui/lib/hooks";
import { useTaskHistoryAnalytics } from "analytics";
import { filterInputDebounceTimeout } from "constants/timeouts";
import { walkthroughFailureSearchProps } from "../constants";
import { TaskHistoryOptions } from "../types";

interface TestFailureSearchInputProps {
  numMatchingResults: number;
}

export const TestFailureSearchInput: React.FC<TestFailureSearchInputProps> = ({
  numMatchingResults,
}) => {
  const { sendEvent } = useTaskHistoryAnalytics();
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

  const handleOnChange = (value: string) => {
    setSearchTerm(value);
    updateQueryParamWithDebounce(value);
    sendEvent({
      name: "Used test failure search",
      "test.name": value,
    });
  };

  // In the case that some other component has updated the failingTest param, we need to update
  // the internal state of searchTerm.
  useEffect(() => {
    if (failingTest !== searchTerm) {
      setSearchTerm(failingTest);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [failingTest]);

  return (
    <>
      <InputContainer>
        <StyledLabel htmlFor={searchInputId}>Search Test Failures</StyledLabel>
        <SearchInput
          aria-label="Search Test Failure Input"
          id={searchInputId}
          onChange={(e) => handleOnChange(e.target.value)}
          placeholder="Search failed test"
          size={SearchInputSize.Small}
          value={searchTerm}
          {...walkthroughFailureSearchProps}
        />
      </InputContainer>
      {numMatchingResults === 0 && failingTest && (
        <NoMatches>No results on this page</NoMatches>
      )}
    </>
  );
};

const searchInputId = "search-test-failures-input";

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${size.xxs};

  * {
    box-sizing: content-box;
  }

  /* Account for chrome blue focus outline */
  margin: 0 ${size.xxs};
`;

const StyledLabel = styled.label`
  font-size: 14px;
  font-weight: 600;
  line-height: 20px;
  margin-bottom: ${size.xxs};
`;

const NoMatches = styled.div`
  margin-left: ${size.xxs};
`;
