import { gql } from "@apollo/client";

const IMAGES = gql`
  query Images {
    images
  }
`;

export default IMAGES;
