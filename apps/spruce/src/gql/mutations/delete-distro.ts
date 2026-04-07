import { gql } from "@apollo/client";

const DELETE_DISTRO = gql`
  mutation DeleteDistro($distroId: String!) {
    deleteDistro(opts: { distroId: $distroId }) {
      deletedDistroId
    }
  }
`;

export default DELETE_DISTRO;
