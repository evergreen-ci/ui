import { useMemo } from "react";
import { useQuery } from "@apollo/client";
import styled from "@emotion/styled";
import Button from "@leafygreen-ui/button";
import { Combobox, ComboboxOption } from "@leafygreen-ui/combobox";
import { BasicEmptyState } from "@leafygreen-ui/empty-state";
import { palette } from "@leafygreen-ui/palette";
import { ListSkeleton } from "@leafygreen-ui/skeleton-loader";
import { H3, Body, H3Props, Disclaimer } from "@leafygreen-ui/typography";
import pluralize from "pluralize";
import { size } from "@evg-ui/lib/constants/tokens";
import { useVersionAnalytics } from "analytics";
import TextInputWithValidation from "components/TextInputWithValidation";
import { failedTaskStatuses, taskStatusToCopy } from "constants/task";
import { useToastContext } from "context/toast";
import {
  TestAnalysisQuery,
  TestAnalysisQueryVariables,
} from "gql/generated/types";
import { TEST_ANALYSIS } from "gql/queries";
import { useQueryParam, useQueryParams } from "hooks/useQueryParam";
import { TestAnalysisQueryParams } from "types/task";
import { reportError } from "utils/errorReporting";
import { validateRegexp } from "utils/validators";
import GroupedTestMapList from "./GroupedTestMapList";
import { TaskBuildVariantField } from "./types";
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
  const [selectedTaskStatuses, setSelectedTaskStatuses] = useQueryParam<
    string[]
  >(TestAnalysisQueryParams.Statuses, []);

  const [selectedBuildVariants, setSelectedBuildVariants] = useQueryParam<
    string[]
  >(TestAnalysisQueryParams.Variants, []);

  const [testName, setTestName] = useQueryParam<string | undefined>(
    TestAnalysisQueryParams.TestName,
    "",
  );
  const [, setQueryParams] = useQueryParams();
  const { sendEvent } = useVersionAnalytics(versionId);

  const dispatchToast = useToastContext();
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
    onError: (err) => {
      dispatchToast.error(`Error fetching test analysis: ${err.message}`);
    },
  });

  const groupedTestsMap = useMemo(
    () => groupTestsByName(data ? data?.version?.tasks?.data : []),
    [data],
  );

  const buildVariants = useMemo(
    () => getAllBuildVariants(groupedTestsMap),
    [groupedTestsMap],
  );
  const taskStatuses = useMemo(
    () => getAllTaskStatuses(groupedTestsMap),
    [groupedTestsMap],
  );
  let filteredGroupedTestsMap = new Map<string, TaskBuildVariantField[]>();
  try {
    filteredGroupedTestsMap = filterGroupedTests(
      groupedTestsMap,
      testName || "",
      selectedTaskStatuses,
      selectedBuildVariants,
    );
  } catch (error) {
    reportError(new Error(`Invalid Regexp: ${error}`)).severe();
    dispatchToast.error(`Invalid Regexp: ${error}`);
  }

  const groupedTestsMapEntries = Array.from(
    filteredGroupedTestsMap.entries(),
  ).sort((a, b) => b[1].length - a[1].length);

  const numberOfTestsThatFailedOnMoreThanOneTask =
    groupedTestsMapEntries.filter(([, tasks]) => tasks.length > 1).length;

  const totalTestCount = countTotalTests(groupedTestsMap);
  const totalFilteredTestCount = countTotalTests(filteredGroupedTestsMap);

  const hasMatchingResults = totalFilteredTestCount > 0;
  const hasResults = Boolean(data) && totalTestCount > 0;
  const hasFiltersApplied =
    selectedTaskStatuses.length > 0 ||
    selectedBuildVariants.length > 0 ||
    (testName || "").length > 0;
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
            <TextInputWithValidation
              aria-labelledby="test-failure-search-label"
              defaultValue={testName}
              disabled={!hasResults}
              id="test-failure-search-input"
              label="Search Test Failures"
              onSubmit={(value) => {
                if (value === "") {
                  setTestName(undefined);
                } else {
                  setTestName(value);
                }
                sendEvent({
                  name: "Filtered test analysis tab",
                  "filter.by": "test name",
                });
              }}
              placeholder="Search failed tests (regex)"
              validator={validateRegexp}
            />
            <Combobox
              disabled={!hasResults}
              label="Failure Type"
              multiselect
              onChange={(value: string[]) => {
                setSelectedTaskStatuses(value);
                sendEvent({
                  name: "Filtered test analysis tab",
                  "filter.by": "task statuses",
                });
              }}
              placeholder="Select a task status"
              value={selectedTaskStatuses}
            >
              {taskStatuses.map((status) => (
                <ComboboxOption
                  key={status}
                  data-cy={`task-status-${status}-option`}
                  displayName={taskStatusToCopy[status]}
                  value={status}
                />
              ))}
            </Combobox>
            <Combobox
              disabled={!hasResults}
              label="Build Variant"
              multiselect
              onChange={(value: string[]) => {
                setSelectedBuildVariants(value);
                sendEvent({
                  name: "Filtered test analysis tab",
                  "filter.by": "build variant",
                });
              }}
              overflow="scroll-x"
              placeholder="Select a build variant"
              value={selectedBuildVariants}
            >
              {buildVariants.map((bv) => (
                <ComboboxOption
                  key={bv.buildVariant}
                  data-cy={`build-variant-${bv.buildVariant}-option`}
                  displayName={bv.buildVariantDisplayName}
                  value={bv.buildVariant}
                />
              ))}
            </Combobox>
          </FilterContainer>
          {hasResults && (
            <FilterSubheaderContainer>
              <Body weight="medium">
                {totalFilteredTestCount}/{totalTestCount} Failed{" "}
                {pluralize("Test", totalFilteredTestCount)}
              </Body>
              <Button
                data-cy="clear-filter-button"
                disabled={!hasFiltersApplied}
                onClick={() => {
                  setQueryParams({
                    [TestAnalysisQueryParams.Statuses]: [],
                    [TestAnalysisQueryParams.Variants]: [],
                    [TestAnalysisQueryParams.TestName]: "",
                  });
                }}
                size="xsmall"
              >
                Clear Filters
              </Button>
              {hasFiltersApplied && <Disclaimer>Filters applied</Disclaimer>}
            </FilterSubheaderContainer>
          )}

          <GroupedTestMapList groupedTestsMapEntries={groupedTestsMapEntries} />
          {!hasMatchingResults && (
            <BasicEmptyState
              description=""
              title={`No ${hasResults ? "matching " : ""}failed tests found`}
            />
          )}
        </>
      )}
    </Container>
  );
};

const Container = styled.div`
  margin-right: ${size.xl};
  margin-left: ${size.xxs};
`;

const FilterSubheaderContainer = styled.div`
  display: flex;
  margin-bottom: ${size.m};
  gap: ${size.xs};
  align-items: center;
`;

const FilterContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: ${size.m};
  margin-top: ${size.s};
  > * {
    flex-basis: 30%;
  }
`;

const Title = styled(H3)<H3Props>`
  color: ${green.dark2};
  margin-bottom: ${size.xs};
`;

export default TestAnalysis;
