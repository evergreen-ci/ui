import { gql } from "@apollo/client";

export const IMAGES = gql`
  query Images {
    images
  }
`;
