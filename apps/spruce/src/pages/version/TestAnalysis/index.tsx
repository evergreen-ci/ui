import { useState } from "react";
import { useQuery } from "@apollo/client";
import styled from "@emotion/styled";
import Button from "@leafygreen-ui/button";
import { Combobox, ComboboxOption } from "@leafygreen-ui/combobox";
import { BasicEmptyState } from "@leafygreen-ui/empty-state";
import { palette } from "@leafygreen-ui/palette";
import { SearchInput } from "@leafygreen-ui/search-input";
import { ListSkeleton } from "@leafygreen-ui/skeleton-loader";
import { H3, Label, Body, H3Props } from "@leafygreen-ui/typography";
import pluralize from "pluralize";
import { failedTaskStatuses, taskStatusToCopy } from "constants/task";
import { size } from "constants/tokens";
import {
  TestAnalysisQuery,
  TestAnalysisQueryVariables,
} from "gql/generated/types";
import { TEST_ANALYSIS } from "gql/queries";
import TestAnalysisTable from "./TestAnalysisTable";
import {
  countTotalTests,
  filterGroupedTests,
  getAllBuildVariants,
  getAllTaskStatuses,
  groupTestsByName,
} from "./utils";

const { green } = palette;
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
  const groupedTestsMapEntries = Array.from(
    filteredGroupedTestsMap.entries(),
  ).sort((a, b) => b[1].length - a[1].length);

  const numberOfTestsThatFailedOnMoreThanOneTask =
    groupedTestsMapEntries.filter(([, tasks]) => tasks.length > 1).length;

  const totalTestCount = countTotalTests(groupedTestsMap);
  const totalFilteredTestCount = countTotalTests(filteredGroupedTestsMap);
  const hasFilters =
    selectedTaskStatuses.length > 0 ||
    selectedBuildVariants.length > 0 ||
    searchValue.length > 0;

  const hasMatchingResults = totalFilteredTestCount > 0;
  const hasResults = data && totalTestCount > 0;
  return (
    <div>
      {loading ? (
        <ListSkeleton />
      ) : (
        <div>
          <Title>
            {numberOfTestsThatFailedOnMoreThanOneTask}{" "}
            {pluralize("test", numberOfTestsThatFailedOnMoreThanOneTask)} failed
            across more than one task
          </Title>
          <Body>
            This page shows tests that failed across more than one task. If a
            test failed on multiple tasks, it may indicate a flaky test or a
            larger issue. Click on the test name to see more details.
          </Body>
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
                disabled={!hasResults}
                id="test-failure-search-input"
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="Search failed tests (regex)"
                value={searchValue}
              />
            </div>
            <Combobox
              disabled={!hasResults}
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
              disabled={!hasResults}
              label="Build Variant"
              multiselect
              onChange={setSelectedBuildVariants}
              placeholder="Select a build variant"
              value={selectedBuildVariants}
            >
              {buildVariants.map((bv) => (
                <ComboboxOption
                  key={bv.buildVariant}
                  displayName={bv.buildVariantDisplayName}
                  value={bv.buildVariant}
                />
              ))}
            </Combobox>
          </FilterContainer>
          {hasResults && (
            <FilterSubheaderContainer>
              <Body weight="medium">
                {hasFilters
                  ? `${totalFilteredTestCount}/${totalTestCount} Filtered Failed ${pluralize("Test", totalFilteredTestCount)}`
                  : `${totalTestCount} Total Failed ${pluralize("Test", totalTestCount)}`}
              </Body>
              {hasFilters && (
                <Button
                  onClick={() => {
                    setSelectedTaskStatuses([]);
                    setSelectedBuildVariants([]);
                    setSearchValue("");
                  }}
                  size="xsmall"
                >
                  Clear Filters
                </Button>
              )}
            </FilterSubheaderContainer>
          )}
          <TestAnalysisTable tasks={groupedTestsMapEntries} />
          {!hasMatchingResults && (
            <BasicEmptyState
              description="For additional analytics on tests please visit Honeycomb"
              title={`No ${hasResults ? "Matching " : ""}Failed Tests Found`}
            />
          )}
        </div>
      )}
    </div>
  );
};

const LabelWrapper = styled.div`
  margin-bottom: ${size.xxs};
  line-height: 20px;
`;
const FilterSubheaderContainer = styled.div`
  display: flex;
  margin-bottom: ${size.m};
  gap: ${size.xs};
`;
const FilterContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: ${size.m};
  > * {
    width: 30%;
  }
`;

const Title = styled(H3)<H3Props>`
  color: ${green.dark2};
`;

export default TestAnalysis;
