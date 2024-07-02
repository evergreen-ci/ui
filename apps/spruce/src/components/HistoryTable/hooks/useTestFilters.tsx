import { useEffect } from "react";
import { useQueryParam } from "hooks/useQueryParam";
import { TestStatus } from "types/history";
import { useHistoryTable } from "../HistoryTableContext";

const useTestFilters = () => {
  // @ts-expect-error: FIXME. This comment was added by an automated script.
  const { setHistoryTableFilters } = useHistoryTable();
  const [failingTests] = useQueryParam<string[]>(TestStatus.Failed, []);
  const [passingTests] = useQueryParam<string[]>(TestStatus.Passed, []);

  useEffect(() => {
    const failingTestFilters = failingTests.map((test) => ({
      testName: test,
      testStatus: TestStatus.Failed,
    }));
    const passingTestFilters = passingTests.map((test) => ({
      testName: test,
      testStatus: TestStatus.Passed,
    }));
    setHistoryTableFilters([...failingTestFilters, ...passingTestFilters]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [passingTests, failingTests]);
};

export default useTestFilters;
