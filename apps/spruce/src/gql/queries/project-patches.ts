import { gql } from "@apollo/client";
import { PATCHES_PAGE_PATCHES } from "../fragments/patchesPage";

const PROJECT_PATCHES = gql`
  query ProjectPatches(
    $projectIdentifier: String!
    $patchesInput: PatchesInput!
  ) {
    project(projectIdentifier: $projectIdentifier) {
      id
      displayName
      patches(patchesInput: $patchesInput) {
        ...PatchesPagePatches
      }
    }
  }
  ${PATCHES_PAGE_PATCHES}
`;

export default PROJECT_PATCHES;
