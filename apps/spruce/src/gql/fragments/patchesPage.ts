import { gql } from "@apollo/client";

export const PATCHES_PAGE_PATCHES = gql`
  fragment PatchesPagePatches on Patches {
    filteredPatchCount
    patches {
      id
      activated
      alias
      createTime
      description
      hidden
      invalidatedByUpstream
      projectIdentifier
      projectMetadata {
        id
        owner
        repo
      }
      status
      user {
        displayName
        userId
      }
      versionFull {
        id
        requester
        status
        taskStatusStats(options: {}) {
          counts {
            count
            status
          }
        }
      }
    }
  }
`;
