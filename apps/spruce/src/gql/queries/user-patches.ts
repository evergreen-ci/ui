import { gql } from "@apollo/client";
import { PATCHES_PAGE_PATCHES } from "../fragments/patchesPage";

export const USER_PATCHES = gql`
  query UserPatches($userId: String, $patchesInput: PatchesInput!) {
    user(userId: $userId) {
      displayName
      patches(patchesInput: $patchesInput) {
        ...PatchesPagePatches
      }
      userId
    }
  }
  ${PATCHES_PAGE_PATCHES}
`;
