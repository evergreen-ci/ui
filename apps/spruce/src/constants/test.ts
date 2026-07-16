import { ALL_VALUE } from "@evg-ui/lib/components/TreeSelect";
import { TestStatus } from "@evg-ui/lib/types/test";

export const testStatusesFilterTreeData = [
  {
    key: ALL_VALUE,
    title: "All",
    value: ALL_VALUE,
  },
  {
    key: TestStatus.Pass,
    title: "Pass",
    value: TestStatus.Pass,
  },
  {
    key: TestStatus.Fail,
    title: "Fail",
    value: TestStatus.Fail,
  },
  {
    key: TestStatus.Skip,
    title: "Skip",
    value: TestStatus.Skip,
  },
  {
    key: TestStatus.SilentFail,
    title: "Silent Fail",
    value: TestStatus.SilentFail,
  },
  {
    key: TestStatus.Timeout,
    title: "Timeout",
    value: TestStatus.Timeout,
  },
];
