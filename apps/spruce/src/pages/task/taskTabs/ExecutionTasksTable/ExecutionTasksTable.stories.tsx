import Cookies from "js-cookie";
import { CustomMeta, CustomStoryObj } from "@evg-ui/lib/test_utils";
import { SEEN_TASK_REVIEW_TOOLTIP } from "constants/cookies";
import ExecutionTasksTable from ".";

export default {
  component: ExecutionTasksTable,
} satisfies CustomMeta<typeof ExecutionTasksTable>;

export const SingleExecution: CustomStoryObj<typeof ExecutionTasksTable> = {
  render: () => {
    Cookies.set(SEEN_TASK_REVIEW_TOOLTIP, new Date("2020-01-01").toString());
    return (
      <ExecutionTasksTable
        execution={5}
        executionTasksFull={singleExecution}
        isPatch
      />
    );
  },
};

export const MultipleExecutions: CustomStoryObj<typeof ExecutionTasksTable> = {
  render: () => {
    Cookies.set(SEEN_TASK_REVIEW_TOOLTIP, new Date("2020-01-01").toString());
    return (
      <ExecutionTasksTable
        execution={14}
        executionTasksFull={multipleExecutions}
        isPatch
      />
    );
  },
};

const singleExecution = [
  {
    execution: 5,
    baseTask: {
      id: "some_id_5_base",
      execution: 5,
      displayStatus: "success",
    },
    buildVariant: "Windows",
    buildVariantDisplayName: "Windows 97",
    displayName: "Some fancy execution task",
    id: "some_id_5",
    displayStatus: "success",
  },
  {
    execution: 5,
    baseStatus: "success",
    baseTask: {
      id: "some_id_6_base",
      execution: 5,
      displayStatus: "success",
    },
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
    baseTask: {
      displayStatus: "failed",
      id: "some_id_5_base",
      execution: 1,
    },
    buildVariant: "Windows",
    buildVariantDisplayName: "Windows 97",
    displayName: "Some fancy execution task",
    id: "some_id_5",
    displayStatus: "success",
  },
  {
    execution: 12,
    baseTask: {
      displayStatus: "success",
      id: "some_id_6_base",
      execution: 1,
    },
    buildVariant: "Windows",
    buildVariantDisplayName: "Windows 97",
    displayName: "Another execution task",
    id: "some_id_6",
    displayStatus: "success",
  },
];
