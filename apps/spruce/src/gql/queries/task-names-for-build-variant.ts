import { gql } from "@apollo/client";

const TASK_NAMES_FOR_BUILD_VARIANT = gql`
  query TaskNamesForBuildVariant(
    $projectIdentifier: String!
    $buildVariant: String!
  ) {
    taskNamesForBuildVariant(
      projectIdentifier: $projectIdentifier
      buildVariant: $buildVariant
    )
  }
`;

export default TASK_NAMES_FOR_BUILD_VARIANT;
