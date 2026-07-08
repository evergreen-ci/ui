import { gql } from "@apollo/client";

export const INSTANCE_TYPES = gql`
  query InstanceTypes {
    instanceTypes
  }
`;
