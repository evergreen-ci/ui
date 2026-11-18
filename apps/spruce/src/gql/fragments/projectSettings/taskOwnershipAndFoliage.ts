import { gql } from "@apollo/client";

export const PROJECT_TASK_OWNERSHIP_AND_FOLIAGE_SETTINGS = gql`
  fragment ProjectTaskOwnershipAndFoliageSettings on Project {
    id
    taskOwnership {
      blockTaskGenerationOnTagValidation
      defaultMothraTeam
      defaultMothraTeamForBreakingCommit
      generatedTaskValidationPrefix
      trackGeneratedTaskTagValidation
    }
  }
`;

export const REPO_TASK_OWNERSHIP_AND_FOLIAGE_SETTINGS = gql`
  fragment RepoTaskOwnershipAndFoliageSettings on RepoRef {
    id
    taskOwnership {
      blockTaskGenerationOnTagValidation
      defaultMothraTeam
      defaultMothraTeamForBreakingCommit
      generatedTaskValidationPrefix
      trackGeneratedTaskTagValidation
    }
  }
`;
