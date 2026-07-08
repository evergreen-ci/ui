import { gql } from "@apollo/client";

export const FILE_DIFFS = gql`
  fragment FileDiffs on FileDiff {
    additions
    deletions
    description
    fileName
  }
`;
