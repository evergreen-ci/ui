import { gql } from "@apollo/client";

const CREATE_PROJECT = gql`
  mutation CreateProject($project: CreateProjectInput!) {
    createProject(project: $project) {
      id
      identifier
    }
  }
`;

export default CREATE_PROJECT;
