import { gql } from "@apollo/client";
import { PATCHES_PAGE_PATCHES } from "../fragments/patchesPage";

const USER_PATCHES = gql`
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

export default USER_PATCHES;
