import { gql } from "@apollo/client";

export const CREATE_DISTRO = gql`
  mutation CreateDistro($opts: CreateDistroInput!) {
    createDistro(opts: $opts) {
      newDistroId
    }
  }
`;
