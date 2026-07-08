import { gql } from "@apollo/client";

export const COPY_DISTRO = gql`
  mutation CopyDistro($opts: CopyDistroInput!) {
    copyDistro(opts: $opts) {
      newDistroId
    }
  }
`;
