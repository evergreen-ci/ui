import { gql } from "@apollo/client";

export const DELETE_PROJECT = gql`
  mutation DeleteProject($projectId: String!) {
    deleteProject(projectId: $projectId)
  }
`;
