import { CustomStoryObj, CustomMeta } from "@evg-ui/lib/test_utils/types";

import { ExecutionTasksTable } from ".";

export default {
  component: ExecutionTasksTable,
} satisfies CustomMeta<typeof ExecutionTasksTable>;

export const SingleExecution: CustomStoryObj<typeof ExecutionTasksTable> = {
  render: () => (
    <ExecutionTasksTable
      execution={5}
      executionTasksFull={singleExecution}
      isPatch
    />
  ),
};

export const MultipleExecutions: CustomStoryObj<typeof ExecutionTasksTable> = {
  render: () => (
    <ExecutionTasksTable
      execution={14}
      executionTasksFull={multipleExecutions}
      isPatch
    />
  ),
};

const singleExecution = [
  {
    execution: 5,
    baseStatus: "success",
    buildVariant: "Windows",
    buildVariantDisplayName: "Windows 97",
    displayName: "Some fancy execution task",
    id: "some_id_5",
    displayStatus: "success",
  },
  {
    execution: 5,
    baseStatus: "success",
    buildVariant: "Windows",
    buildVariantDisplayName: "Windows 97",
    displayName: "Another execution task",
    id: "some_id_6",
    displayStatus: "success",
  },
];

const multipleExecutions = [
  {
    execution: 14,
    baseStatus: "success",
    buildVariant: "Windows",
    buildVariantDisplayName: "Windows 97",
    displayName: "Some fancy execution task",
    id: "some_id_5",
    displayStatus: "success",
  },
  {
    execution: 12,
    baseStatus: "success",
    buildVariant: "Windows",
    buildVariantDisplayName: "Windows 97",
    displayName: "Another execution task",
    id: "some_id_6",
    displayStatus: "success",
  },
];
