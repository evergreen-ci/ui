import { gql } from "@apollo/client";
import { BASE_PATCH } from "../fragments/basePatch";

const PATCH_CONFIGURE = gql`
  query ConfigurePatch($id: String!) {
    patch(patchId: $id) {
      ...BasePatch
      childPatchAliases {
        alias
        patchId
      }
      childPatches {
        id
        projectIdentifier
        variantsTasks {
          name
          tasks
        }
      }
      githubPatchData {
        prNumber
      }
      patchTriggerAliases {
        alias
        childProjectId
        childProjectIdentifier
        variantsTasks {
          name
          tasks
        }
      }
      project {
        variants {
          displayName
          name
          tasks
        }
      }
      projectIdentifier
      time {
        submittedAt
      }
      versionFull {
        id
      }
    }
  }
  ${BASE_PATCH}
`;

export default PATCH_CONFIGURE;
