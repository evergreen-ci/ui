import { gql } from "@apollo/client";

export const SET_VERSION_PRIORITY = gql`
  mutation SetVersionPriority($versionId: String!, $priority: Int!) {
    setVersionPriority(versionId: $versionId, priority: $priority)
  }
`;
