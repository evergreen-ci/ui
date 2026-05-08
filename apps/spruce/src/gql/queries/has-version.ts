import { gql } from "@apollo/client";

export const HAS_VERSION = gql`
  query HasVersion($id: String!) {
    hasVersion(patchId: $id)
  }
`;
