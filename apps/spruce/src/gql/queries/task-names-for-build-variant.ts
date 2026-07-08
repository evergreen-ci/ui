import { gql } from "@apollo/client";

export const TASK_NAMES_FOR_BUILD_VARIANT = gql`
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
