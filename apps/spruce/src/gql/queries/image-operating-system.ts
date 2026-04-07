import { gql } from "@apollo/client";

const IMAGE_OPERATING_SYSTEM = gql`
  query ImageOperatingSystem($imageId: String!, $opts: OperatingSystemOpts!) {
    image(imageId: $imageId) {
      id
      operatingSystem(opts: $opts) {
        data {
          name
          version
        }
        filteredCount
        totalCount
      }
    }
  }
`;

export default IMAGE_OPERATING_SYSTEM;
