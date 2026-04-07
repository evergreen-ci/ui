import { gql } from "@apollo/client";
import { BASE_PATCH } from "../fragments/basePatch";

export const SCHEDULE_PATCH = gql`
  mutation SchedulePatch($patchId: String!, $configure: PatchConfigure!) {
    schedulePatch(patchId: $patchId, configure: $configure) {
      ...BasePatch
      tasks
      variants
      versionFull {
        id
        childVersions {
          id
        }
      }
    }
  }
  ${BASE_PATCH}
`;
