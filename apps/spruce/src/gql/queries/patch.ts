import { gql } from "@apollo/client";
import { BASE_PATCH } from "../fragments/basePatch";

const PATCH = gql`
  query Patch($id: String!) {
    patch(patchId: $id) {
      ...BasePatch
      githash
      patchNumber
      projectID
      projectIdentifier
      versionFull {
        id
      }
    }
  }
  ${BASE_PATCH}
`;

export default PATCH;
