import { gql } from "@apollo/client";

export const COPY_PROJECT = gql`
  mutation CopyProject($project: CopyProjectInput!) {
    copyProject(project: $project) {
      id
      identifier
    }
  }
`;
