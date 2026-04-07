import { gql } from "@apollo/client";

const IMAGE_DISTROS = gql`
  query ImageDistros($imageId: String!) {
    image(imageId: $imageId) {
      id
      distros {
        hostAllocatorSettings {
          maximumHosts
        }
        name
        provider
        providerSettingsList
      }
    }
  }
`;

export default IMAGE_DISTROS;
