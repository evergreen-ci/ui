import { gql } from "@apollo/client";

export const PROJECT_TASK_OWNERSHIP_AND_FOLIAGE_SETTINGS = gql`
  fragment ProjectTaskOwnershipAndFoliageSettings on Project {
    id
    taskOwnership {
      blockOnTagValidation
      defaultMothraTeam
      defaultMothraTeamForBreakingCommit
      tagValidationPrefix
      trackTagValidation
    }
  }
`;

export const REPO_TASK_OWNERSHIP_AND_FOLIAGE_SETTINGS = gql`
  fragment RepoTaskOwnershipAndFoliageSettings on RepoRef {
    id
    taskOwnership {
      blockOnTagValidation
      defaultMothraTeam
      defaultMothraTeamForBreakingCommit
      tagValidationPrefix
      trackTagValidation
    }
  }
`;
