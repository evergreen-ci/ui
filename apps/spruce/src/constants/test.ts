import { ALL_VALUE } from "@evg-ui/lib/components";
import { TestStatus } from "@evg-ui/lib/types";

export const testStatusesFilterTreeData = [
  {
    title: "All",
    value: ALL_VALUE,
    key: ALL_VALUE,
  },
  {
    title: "Pass",
    value: TestStatus.Pass,
    key: TestStatus.Pass,
  },
  {
    title: "Fail",
    value: TestStatus.Fail,
    key: TestStatus.Fail,
  },
  {
    title: "Skip",
    value: TestStatus.Skip,
    key: TestStatus.Skip,
  },
  {
    title: "Silent Fail",
    value: TestStatus.SilentFail,
    key: TestStatus.SilentFail,
  },
];
