import { gql } from "@apollo/client";

export const IMAGE_FILES = gql`
  query ImageFiles($imageId: String!, $opts: ImageFileOpts!) {
    image(imageId: $imageId) {
      id
      files(opts: $opts) {
        data {
          name
          path
          version
        }
        filteredCount
        totalCount
      }
    }
  }
`;
