import { gql } from "@apollo/client";

export const IMAGE_GENERAL = gql`
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
