import { gql } from "@apollo/client";

export const TASK_CONFIG = gql`
  query TaskConfig($taskId: String!, $execution: Int) {
    task(taskId: $taskId, execution: $execution) {
      id
      config {
        activate
        allowedBranches
        allowedRequesters
        allowForGitTag
        batchTime
        cronBatchTime
        dependsOn {
          name
          omitGeneratedTasks
          patchOptional
          status
          variant
        }
        disable
        execTimeoutSecs
        gitTagOnly
        groupName
        isGroup
        isPartOfGroup
        name
        patchable
        patchOnly
        priority
        ps
        runOn
        stepback
      }
      execution
    }
  }
`;
