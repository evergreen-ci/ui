import { gql } from "@apollo/client";
import { BASE_PATCH } from "../fragments/basePatch";

export const PATCH_CONFIGURE = gql`
  query ConfigurePatch($id: String!) {
    patch(patchId: $id) {
      ...BasePatch
      childPatchAliases {
        alias
        patchId
      }
      childPatches {
        id
        projectMetadata {
          id
          identifier
        }
        variantsTasks {
          name
          tasks
        }
      }
      createTime
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
      projectMetadata {
        id
        identifier
      }
      version {
        id
      }
    }
  }
  ${BASE_PATCH}
`;
