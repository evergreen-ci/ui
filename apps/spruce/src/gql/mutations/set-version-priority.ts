import { gql } from "@apollo/client";

const SET_VERSION_PRIORITY = gql`
  mutation SetVersionPriority($versionId: String!, $priority: Int!) {
    setVersionPriority(versionId: $versionId, priority: $priority)
  }
`;

export default SET_VERSION_PRIORITY;
