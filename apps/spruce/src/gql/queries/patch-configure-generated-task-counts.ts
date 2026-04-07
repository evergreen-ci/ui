import { gql } from "@apollo/client";

const PATCH_CONFIGURE_GENERATED_TASK_COUNTS = gql`
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

export default PATCH_CONFIGURE_GENERATED_TASK_COUNTS;
