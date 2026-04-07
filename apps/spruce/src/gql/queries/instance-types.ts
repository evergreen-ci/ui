import { gql } from "@apollo/client";

const INSTANCE_TYPES = gql`
  query InstanceTypes {
    instanceTypes
  }
`;

export default INSTANCE_TYPES;
