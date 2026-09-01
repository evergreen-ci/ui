import { gql } from "@apollo/client";

export const DISTROS = gql`
  query Distros($onlySpawnable: Boolean!) {
    distros(onlySpawnable: $onlySpawnable) {
      id
      adminOnly
      aliases
      availableRegions
      isVirtualWorkStation
      name
    }
  }
`;
