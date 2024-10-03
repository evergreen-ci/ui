import { useState, useMemo } from "react";
import { useQuery } from "@apollo/client";
import styled from "@emotion/styled";
import Button from "@leafygreen-ui/button";
import { Combobox, ComboboxOption } from "@leafygreen-ui/combobox";
import { BasicEmptyState } from "@leafygreen-ui/empty-state";
import { palette } from "@leafygreen-ui/palette";
import { ListSkeleton } from "@leafygreen-ui/skeleton-loader";
import { H3, Label, Body, H3Props } from "@leafygreen-ui/typography";
import pluralize from "pluralize";
import { size } from "@evg-ui/lib/constants/tokens";
import TextInputWithValidation from "components/TextInputWithValidation";
import { failedTaskStatuses, taskStatusToCopy } from "constants/task";
import {
  TestAnalysisQuery,
  TestAnalysisQueryVariables,
} from "gql/generated/types";
import { TEST_ANALYSIS } from "gql/queries";
import GroupedTestMapList from "./GroupedTestMapList";
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

  const groupedTestsMap = useMemo(
    () => groupTestsByName(data ? data?.version?.tasks?.data : []),
    [data],
  );

  const buildVariants = useMemo(
    () => getAllBuildVariants(groupedTestsMap),
    [data],
  );
  const taskStatuses = useMemo(
    () => getAllTaskStatuses(groupedTestsMap),
    [data],
  );

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

  const hasMatchingResults = totalFilteredTestCount > 0;
  const hasResults = data && totalTestCount > 0;
  return (
    <Container>
      {loading ? (
        <ListSkeleton />
      ) : (
        <>
          <Title>
            {numberOfTestsThatFailedOnMoreThanOneTask}{" "}
            {pluralize("test", numberOfTestsThatFailedOnMoreThanOneTask)} failed
            across more than one task
          </Title>
          <Body>
            This page provides an overview of all test failures in the current
            version. If a test fails across multiple tasks, it could suggest a
            flaky test or a broader issue.
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
              <TextInputWithValidation
                aria-labelledby="test-failure-search-label"
                disabled={!hasResults}
                id="test-failure-search-input"
                onChange={(value) => {
                  setSearchValue(value);
                }}
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
              overflow="scroll-x"
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
                {totalFilteredTestCount}/{totalTestCount} Filtered Failed{" "}
                {pluralize("Test", totalFilteredTestCount)}
              </Body>
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
            </FilterSubheaderContainer>
          )}

          <GroupedTestMapList groupedTestsMapEntries={groupedTestsMapEntries} />
          {!hasMatchingResults && (
            <BasicEmptyState
              description="For additional analytics on tests please visit Honeycomb"
              title={`No ${hasResults ? "Matching " : ""}Failed Tests Found`}
            />
          )}
        </>
      )}
    </Container>
  );
};

const Container = styled.div`
  margin: 0 ${size.xs};
`;

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
  margin-top: ${size.xs};
  > * {
    width: 30%;
  }
`;

const Title = styled(H3)<H3Props>`
  color: ${green.dark2};
  margin-bottom: ${size.xs};
`;

export default TestAnalysis;
