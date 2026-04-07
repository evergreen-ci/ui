import { gql } from "@apollo/client";

const SUBNET_AVAILABILITY_ZONES = gql`
  query SubnetAvailabilityZones {
    subnetAvailabilityZones
  }
`;

export default SUBNET_AVAILABILITY_ZONES;
