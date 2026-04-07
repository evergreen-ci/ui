import { gql } from "@apollo/client";

const TASK_PERF_PLUGIN_ENABLED = gql`
  query TaskPerfPluginEnabled($taskId: String!, $execution: Int) {
    task(taskId: $taskId, execution: $execution) {
      id
      execution
      isPerfPluginEnabled
    }
  }
`;

export default TASK_PERF_PLUGIN_ENABLED;
