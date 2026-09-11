import { useQuery } from "@apollo/client/react";
import { Skeleton, Text } from "@via-ds/components";
import { StyledRouterLink } from "@evg-ui/lib/components/styles";
import { TestStatus } from "@evg-ui/lib/types/test";
import { getTaskRoute } from "constants/routes";
import { TaskTestsQuery, TaskTestsQueryVariables } from "gql/generated/types";
import { TASK_TESTS } from "gql/queries";
import { TaskTab } from "types/task";
import styles from "./FailingTests.module.css";

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
    return (
      <Skeleton isLoading>
        <Text>Loading failing tests</Text>
      </Skeleton>
    );
  }

  if (!hasTestResults) {
    return null;
  }

  return (
    <div className={styles.container}>
      <b>Failing Test(s):</b>
      <ul className={styles.list}>
        {testResults.map((test) => (
          <li key={test.testFile} className={styles.listItem}>
            {test.testFile}
          </li>
        ))}
      </ul>
      {filteredTestCount && filteredTestCount > FAILING_TEST_LIMIT ? (
        <StyledRouterLink
          to={getTaskRoute(taskId, { execution, tab: TaskTab.Tests })}
        >
          View all {filteredTestCount} failing tests
        </StyledRouterLink>
      ) : null}
    </div>
  );
};
