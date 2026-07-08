import { gql } from "@apollo/client";

export const PATCH_CONFIGURE_GENERATED_TASK_COUNTS = gql`
  query PatchConfigureGeneratedTaskCounts($patchId: String!) {
    patch(patchId: $patchId) {
      id
      generatedTaskCounts {
        buildVariantName
        estimatedTasks
        taskName
      }
    }
  }
`;
