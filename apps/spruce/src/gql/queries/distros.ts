import { gql } from "@apollo/client";

const DISTROS = gql`
  query Distros($onlySpawnable: Boolean!) {
    distros(onlySpawnable: $onlySpawnable) {
      adminOnly
      aliases
      availableRegions
      isVirtualWorkStation
      name
    }
  }
`;

export default DISTROS;
