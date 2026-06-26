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
      projectMetadata {
        id
        identifier
        owner
        repo
      }
      status
      user: userLite {
        displayName
        userId: id
      }
      version {
        id
        requester
        status
        taskStatusStats {
          counts {
            count
            status
          }
        }
      }
    }
  }
`;
