import { useEffect, useMemo, useState } from "react";
import styled from "@emotion/styled";
import TextInput from "@leafygreen-ui/text-input";
import debounce from "lodash.debounce";
import { useQueryParam } from "hooks/useQueryParam";
import { TaskHistoryOptions } from "./types";

export const TestFailureSearchInput = () => {
  const [failingTest, setFailingTest] = useQueryParam<string | undefined>(
    TaskHistoryOptions.FailingTest,
    "",
  );

  const [searchTerm, setSearchTerm] = useState(failingTest);
  const updateQueryParamWithDebounce = useMemo(
    () => debounce((str) => setFailingTest(str ? str : undefined), 150),
    [setFailingTest],
  );
  useEffect(() => {
    if (searchTerm !== failingTest) {
      updateQueryParamWithDebounce(searchTerm);
    }
  }, [searchTerm]);

  return (
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
  );
};

const StyledInput = styled(TextInput)`
  /* Account for chrome blue focus outline */
  margin: 0 ${size.xxs};
`;
