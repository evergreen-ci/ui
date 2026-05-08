import { useEffect } from "react";
import { useQueryParam } from "@evg-ui/lib/hooks";
import { TestStatus } from "types/history";
import { useHistoryTable } from "../HistoryTableContext";

const useTestFilters = () => {
  const [failingTests] = useQueryParam<string[]>(TestStatus.Failed, []);
  const [passingTests] = useQueryParam<string[]>(TestStatus.Passed, []);

  // @ts-expect-error: FIXME. This comment was added by an automated script.
  const { setHistoryTableFilters } = useHistoryTable();

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
  }, [failingTests, passingTests]);
};

export default useTestFilters;
