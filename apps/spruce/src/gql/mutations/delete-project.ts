import { gql } from "@apollo/client";

const DELETE_PROJECT = gql`
  mutation DeleteProject($projectId: String!) {
    deleteProject(projectId: $projectId)
  }
`;

export default DELETE_PROJECT;
