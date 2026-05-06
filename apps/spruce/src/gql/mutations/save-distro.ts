import { gql } from "@apollo/client";

export const SAVE_DISTRO = gql`
  mutation SaveDistro($distro: DistroInput!, $onSave: DistroOnSaveOperation!) {
    saveDistro(opts: { distro: $distro, onSave: $onSave }) {
      distro {
        name
      }
      hostCount
    }
  }
`;
