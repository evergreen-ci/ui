import { gql } from "@apollo/client";

const SET_TASK_PRIORITIES = gql`
  mutation SetTaskPriorities($taskPriorities: [TaskPriority!]!) {
    setTaskPriorities(taskPriorities: $taskPriorities) {
      id
      execution
      priority
    }
  }
`;

export default SET_TASK_PRIORITIES;
