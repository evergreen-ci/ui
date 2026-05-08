import { gql } from "@apollo/client";

export const SUBNET_AVAILABILITY_ZONES = gql`
  query SubnetAvailabilityZones {
    subnetAvailabilityZones
  }
`;
