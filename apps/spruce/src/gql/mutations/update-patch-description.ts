import { gql } from "@apollo/client";
import { BASE_PATCH } from "../fragments/basePatch";

export const UPDATE_PATCH_DESCRIPTION = gql`
  mutation UpdatePatchDescription($patchId: String!, $description: String!) {
    schedulePatch(
      patchId: $patchId
      configure: { variantsTasks: [], description: $description }
    ) {
      ...BasePatch
    }
  }
  ${BASE_PATCH}
`;
