import { gql } from "@apollo/client";

export const CREATE_PROJECT = gql`
  mutation CreateProject($project: CreateProjectInput!) {
    createProject(project: $project) {
      id
      identifier
    }
  }
`;
