import { gql } from "@apollo/client";

const CREATE_DISTRO = gql`
  mutation CreateDistro($opts: CreateDistroInput!) {
    createDistro(opts: $opts) {
      newDistroId
    }
  }
`;

export default CREATE_DISTRO;
