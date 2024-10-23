import { useMemo } from "react";
import { useQuery } from "@apollo/client";
import styled from "@emotion/styled";
import { BasicEmptyState } from "@leafygreen-ui/empty-state";
import { palette } from "@leafygreen-ui/palette";
import { ListSkeleton } from "@leafygreen-ui/skeleton-loader";
import { H3, Body, H3Props } from "@leafygreen-ui/typography";
import pluralize from "pluralize";
import { size } from "@evg-ui/lib/constants/tokens";
import { failedTaskStatuses } from "constants/task";
import { useToastContext } from "context/toast";
import {
  TestAnalysisQuery,
  TestAnalysisQueryVariables,
} from "gql/generated/types";
import { TEST_ANALYSIS } from "gql/queries";
import { useQueryParam } from "hooks/useQueryParam";
import { TestAnalysisQueryParams } from "types/task";
import { reportError } from "utils/errorReporting";
import FilterGroup from "./FilterGroup";
import GroupedTestMapList from "./GroupedTestMapList";
import { countTotalTests, filterGroupedTests, groupTestsByName } from "./utils";

const { green } = palette;
interface TestAnalysisProps {
  versionId: string;
}
const TestAnalysis: React.FC<TestAnalysisProps> = ({ versionId }) => {
  const [selectedTaskStatuses] = useQueryParam<string[]>(
    TestAnalysisQueryParams.Statuses,
    [],
  );

  const [selectedBuildVariants] = useQueryParam<string[]>(
    TestAnalysisQueryParams.Variants,
    [],
  );

  const [testName] = useQueryParam<string | undefined>(
    TestAnalysisQueryParams.TestName,
    "",
  );

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

  let testNameRegex = /./;
  try {
    testNameRegex = new RegExp(testName || "", "i");
  } catch (error) {
    reportError(new Error(`Invalid Regexp: ${error}`)).severe();
    dispatchToast.error(`Invalid Regexp: ${error}`);
  }

  const filteredGroupedTestsMap = filterGroupedTests(
    groupedTestsMap,
    testNameRegex,
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
  const hasResults = Boolean(data) && totalTestCount > 0;

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
          <FilterGroup
            groupedTestsMap={groupedTestsMap}
            hasResults={hasResults}
            totalFilteredTestCount={totalFilteredTestCount}
            totalTestCount={totalTestCount}
            versionId={versionId}
          />
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

const Title = styled(H3)<H3Props>`
  color: ${green.dark2};
  margin-bottom: ${size.xs};
`;

export default TestAnalysis;
