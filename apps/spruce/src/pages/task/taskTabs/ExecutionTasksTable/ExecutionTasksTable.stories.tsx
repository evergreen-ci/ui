import Cookies from "js-cookie";
import { CustomMeta, CustomStoryObj } from "@evg-ui/lib/test_utils/types";
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
    baseTask: {
      displayStatus: "success",
      execution: 5,
      id: "some_id_5_base",
    },
    buildVariant: "Windows",
    buildVariantDisplayName: "Windows 97",
    displayName: "Some fancy execution task",
    displayStatus: "success",
    execution: 5,
    id: "some_id_5",
  },
  {
    baseStatus: "success",
    baseTask: {
      displayStatus: "success",
      execution: 5,
      id: "some_id_6_base",
    },
    buildVariant: "Windows",
    buildVariantDisplayName: "Windows 97",
    displayName: "Another execution task",
    displayStatus: "success",
    execution: 5,
    id: "some_id_6",
  },
];

const multipleExecutions = [
  {
    baseTask: {
      displayStatus: "failed",
      execution: 1,
      id: "some_id_5_base",
    },
    buildVariant: "Windows",
    buildVariantDisplayName: "Windows 97",
    displayName: "Some fancy execution task",
    displayStatus: "success",
    execution: 14,
    id: "some_id_5",
  },
  {
    baseTask: {
      displayStatus: "success",
      execution: 1,
      id: "some_id_6_base",
    },
    buildVariant: "Windows",
    buildVariantDisplayName: "Windows 97",
    displayName: "Another execution task",
    displayStatus: "success",
    execution: 12,
    id: "some_id_6",
  },
];
