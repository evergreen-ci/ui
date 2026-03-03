import { useQuery } from "@apollo/client/react";
import styled from "@emotion/styled";
import { Skeleton, Size as SkeletonSize } from "@leafygreen-ui/skeleton-loader";
import { StyledRouterLink } from "@evg-ui/lib/components/styles";
import { size } from "@evg-ui/lib/constants/tokens";
import { TestStatus } from "@evg-ui/lib/types/test";
import { getTaskRoute } from "constants/routes";
import { TaskTestsQuery, TaskTestsQueryVariables } from "gql/generated/types";
import { TASK_TESTS } from "gql/queries";
import { TaskTab } from "types/task";

const FAILING_TEST_LIMIT = 3;
interface FailingTestsProps {
  execution: number;
  taskId: string;
}

export const FailingTests: React.FC<FailingTestsProps> = ({
  execution,
  taskId,
}) => {
  const { data, loading } = useQuery<TaskTestsQuery, TaskTestsQueryVariables>(
    TASK_TESTS,
    {
      variables: {
        id: taskId,
        execution,
        statusList: [TestStatus.Fail, TestStatus.SilentFail],
        limitNum: FAILING_TEST_LIMIT,
        testName: "",
      },
      // TODO DEVPROD-27824: Remove "no-cache" policy.
      fetchPolicy: "no-cache",
    },
  );
  const { task } = data || {};
  const { tests } = task || {};
  const { filteredTestCount, testResults } = tests || {};

  const hasTestResults = testResults && testResults.length > 0;

  if (loading) {
    return <Skeleton size={SkeletonSize.Small} />;
  }

  if (!hasTestResults) {
    return null;
  }

  return (
    <FailingTestsContainer>
      <b>Failing Test(s):</b>
      <FailingTestsList>
        {testResults.map((test) => (
          <FailingTestListItem key={test.testFile}>
            {test.testFile}
          </FailingTestListItem>
        ))}
      </FailingTestsList>
      {filteredTestCount && filteredTestCount > FAILING_TEST_LIMIT ? (
        <StyledRouterLink
          to={getTaskRoute(taskId, { execution, tab: TaskTab.Tests })}
        >
          View all {filteredTestCount} failing tests
        </StyledRouterLink>
      ) : null}
    </FailingTestsContainer>
  );
};

const FailingTestsList = styled.ul`
  margin: 0;
  padding: 0;
  list-style-type: none;
`;

const FailingTestListItem = styled.li`
  word-break: break-all;
`;

const FailingTestsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${size.xxs};
`;
