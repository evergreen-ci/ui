import { gql } from "@apollo/client";
import { BASE_PATCH } from "../fragments/basePatch";

export const PATCH = gql`
  query Patch($id: String!) {
    patch(patchId: $id) {
      ...BasePatch
      githash
      patchNumber
      projectMetadata {
        id
        identifier
      }
      versionFull {
        id
      }
    }
  }
  ${BASE_PATCH}
`;
