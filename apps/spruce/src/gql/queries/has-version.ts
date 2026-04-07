import { gql } from "@apollo/client";

const HAS_VERSION = gql`
  query HasVersion($id: String!) {
    hasVersion(patchId: $id)
  }
`;

export default HAS_VERSION;
