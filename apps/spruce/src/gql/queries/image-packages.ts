import { gql } from "@apollo/client";

const IMAGE_PACKAGES = gql`
  query ImagePackages($imageId: String!, $opts: PackageOpts!) {
    image(imageId: $imageId) {
      id
      packages(opts: $opts) {
        data {
          manager
          name
          version
        }
        filteredCount
        totalCount
      }
    }
  }
`;

export default IMAGE_PACKAGES;
