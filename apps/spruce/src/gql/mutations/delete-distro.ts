import { gql } from "@apollo/client";

export const DELETE_DISTRO = gql`
  mutation DeleteDistro($distroId: String!) {
    deleteDistro(opts: { distroId: $distroId }) {
      deletedDistroId
    }
  }
`;
