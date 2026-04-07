import { gql } from "@apollo/client";

const COPY_PROJECT = gql`
  mutation CopyProject($project: CopyProjectInput!) {
    copyProject(project: $project) {
      id
      identifier
    }
  }
`;

export default COPY_PROJECT;
