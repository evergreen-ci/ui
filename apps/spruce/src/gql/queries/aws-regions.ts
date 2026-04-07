import { gql } from "@apollo/client";

const AWS_REGIONS = gql`
  query AWSRegions {
    awsRegions
  }
`;

export default AWS_REGIONS;
