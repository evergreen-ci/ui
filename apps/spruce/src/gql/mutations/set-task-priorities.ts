import { gql } from "@apollo/client";

export const SET_TASK_PRIORITIES = gql`
  mutation SetTaskPriorities($taskPriorities: [TaskPriority!]!) {
    setTaskPriorities(taskPriorities: $taskPriorities) {
      id
      execution
      priority
    }
  }
`;
