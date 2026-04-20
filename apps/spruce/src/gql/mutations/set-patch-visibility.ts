import { gql } from "@apollo/client";

export const SET_PATCH_VISIBILITY = gql`
  mutation SetPatchVisibility($patchIds: [String!]!, $hidden: Boolean!) {
    setPatchVisibility(patchIds: $patchIds, hidden: $hidden) {
      id
      hidden
    }
  }
`;
