import { gql } from "@apollo/client";

const COPY_DISTRO = gql`
  mutation CopyDistro($opts: CopyDistroInput!) {
    copyDistro(opts: $opts) {
      newDistroId
    }
  }
`;

export default COPY_DISTRO;
