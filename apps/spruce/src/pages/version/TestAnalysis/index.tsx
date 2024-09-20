import { useState } from "react";
import { useQuery } from "@apollo/client";
import styled from "@emotion/styled";
import Banner from "@leafygreen-ui/banner";
import { Combobox, ComboboxOption } from "@leafygreen-ui/combobox";
import { SearchInput } from "@leafygreen-ui/search-input";
import { ListSkeleton } from "@leafygreen-ui/skeleton-loader";
import { Body, H3, Label } from "@leafygreen-ui/typography";
import pluralize from "pluralize";
import { Accordion } from "components/Accordion";
import { failedTaskStatuses, taskStatusToCopy } from "constants/task";
import { size } from "constants/tokens";
import {
  TestAnalysisQuery,
  TestAnalysisQueryVariables,
} from "gql/generated/types";
import { TEST_ANALYSIS } from "gql/queries";
import {
  filterGroupedTests,
  getAllBuildVariants,
  getAllTaskStatuses,
  groupTestsByName,
} from "./utils";

interface TestAnalysisProps {
  versionId: string;
}
const TestAnalysis: React.FC<TestAnalysisProps> = ({ versionId }) => {
  const [selectedTaskStatuses, setSelectedTaskStatuses] = useState<string[]>(
    [],
  );
  const [selectedBuildVariants, setSelectedBuildVariants] = useState<string[]>(
    [],
  );
  const [searchValue, setSearchValue] = useState<string>("");
  const { data, loading } = useQuery<
    TestAnalysisQuery,
    TestAnalysisQueryVariables
  >(TEST_ANALYSIS, {
    variables: {
      versionId,
      options: {
        statuses: failedTaskStatuses,
      },
      opts: {
        statuses: ["fail"],
      },
    },
  });

  const groupedTestsMap = groupTestsByName(
    data ? data?.version?.tasks?.data : [],
  );

  const buildVariants = getAllBuildVariants(groupedTestsMap);
  const taskStatuses = getAllTaskStatuses(groupedTestsMap);

  const filteredGroupedTestsMap = filterGroupedTests(
    groupedTestsMap,
    searchValue,
    selectedTaskStatuses,
    selectedBuildVariants,
  );
  const groupedTestsMapEntries = Array.from(filteredGroupedTestsMap.entries());
  const testsThatFailedAcrossMoreThanOneTask = groupedTestsMapEntries.filter(
    ([, tasks]) => tasks.length > 1,
  );

  return (
    <div>
      {loading ? (
        <ListSkeleton />
      ) : (
        <div>
          <H3>
            {testsThatFailedAcrossMoreThanOneTask.length} tests failed across
            more than one task
          </H3>
          <Banner variant="info">
            This page shows tests that failed across more than one task. If a
            test failed on multiple tasks, it may indicate a flaky test or a
            larger issue. Click on the test name to see more details.
          </Banner>
          <FilterContainer>
            <div>
              <LabelWrapper>
                <Label
                  htmlFor="test-failure-search"
                  id="test-failure-search-label"
                >
                  Search Test Failures
                </Label>
              </LabelWrapper>
              <SearchInput
                aria-labelledby="test-failure-search-label"
                id="test-failure-search-input"
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="Search failed tests (regex)"
                value={searchValue}
              />
            </div>
            <Combobox
              label="Failure type"
              multiselect
              onChange={setSelectedTaskStatuses}
              placeholder="Select a task status"
              value={selectedTaskStatuses}
            >
              {taskStatuses.map((status) => (
                <ComboboxOption
                  key={status}
                  displayName={taskStatusToCopy[status]}
                  value={status}
                />
              ))}
            </Combobox>
            <Combobox
              label="Build Variant"
              multiselect
              onChange={setSelectedBuildVariants}
              placeholder="Select a build variant"
              value={selectedBuildVariants}
            >
              {buildVariants.map((variant) => (
                <ComboboxOption key={variant} value={variant} />
              ))}
            </Combobox>
          </FilterContainer>
          {/* Iterate through groupedTestsMap and print the test name followed by the length of value */}
          {groupedTestsMapEntries.map(([test, tasks]) => (
            <SpacedDiv key={test}>
              <Accordion
                title={
                  <Body>
                    <b>{test}</b> failed on{" "}
                    <b>
                      {tasks.length} {pluralize("task", tasks.length)}
                    </b>
                  </Body>
                }
              >
                <div />
              </Accordion>
            </SpacedDiv>
          ))}
        </div>
      )}
    </div>
  );
};

const LabelWrapper = styled.div`
  margin-bottom: ${size.xxs};
  line-height: 20px;
`;
const FilterContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: ${size.m};
  > * {
    width: 30%;
  }
`;
const SpacedDiv = styled.div`
  margin-top: ${size.s};
`;

export default TestAnalysis;
