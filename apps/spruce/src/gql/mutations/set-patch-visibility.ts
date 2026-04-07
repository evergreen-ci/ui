import { gql } from "@apollo/client";

const SET_PATCH_VISIBILITY = gql`
  mutation SetPatchVisibility($patchIds: [String!]!, $hidden: Boolean!) {
    setPatchVisibility(patchIds: $patchIds, hidden: $hidden) {
      id
      hidden
    }
  }
`;

export default SET_PATCH_VISIBILITY;
