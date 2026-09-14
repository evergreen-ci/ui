import { gql } from "@apollo/client";

export const IMAGE_DISTROS = gql`
  query ImageDistros($imageId: String!) {
    image(imageId: $imageId) {
      id
      distros {
        id
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
