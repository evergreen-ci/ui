import { gql } from "@apollo/client";

const IMAGE_GENERAL = gql`
  query ImageGeneral($imageId: String!) {
    image(imageId: $imageId) {
      id
      ami
      lastDeployed
      latestTask {
        id
        execution
        finishTime
      }
    }
  }
`;

export default IMAGE_GENERAL;
