import { gql } from "@apollo/client";

export const IMAGE_TOOLCHAINS = gql`
  query ImageToolchains($imageId: String!, $opts: ToolchainOpts!) {
    image(imageId: $imageId) {
      id
      toolchains(opts: $opts) {
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
