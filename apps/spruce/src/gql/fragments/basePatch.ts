import { gql } from "@apollo/client";

export const BASE_PATCH = gql`
  fragment BasePatch on Patch {
    id
    activated
    alias
    description
    parameters {
      key
      value
    }
    projectMetadata {
      id
    }
    status
    user: userLite {
      displayName
      userId: id
    }
    variantsTasks {
      name
      tasks
    }
  }
`;
