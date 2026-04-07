import { gql } from "@apollo/client";

const DEACTIVATE_STEPBACK_TASK = gql`
  mutation DeactivateStepbackTask(
    $projectId: String!
    $buildVariantName: String!
    $taskName: String!
  ) {
    deactivateStepbackTask(
      opts: {
        projectId: $projectId
        buildVariantName: $buildVariantName
        taskName: $taskName
      }
    )
  }
`;

export default DEACTIVATE_STEPBACK_TASK;
