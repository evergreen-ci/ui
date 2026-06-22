import { gql } from "@apollo/client";
import { PATCHES_PAGE_PATCHES } from "../fragments/patchesPage";

export const USER_PATCHES = gql`
  query UserPatches($userId: String, $patchesInput: PatchesInput!) {
    user: userLite(userId: $userId) {
      displayName
      patches(patchesInput: $patchesInput) {
        ...PatchesPagePatches
      }
      userId: id
    }
  }
  ${PATCHES_PAGE_PATCHES}
`;
