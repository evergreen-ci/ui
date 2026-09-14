import { gql } from "@apollo/client";

export const PROJECT_TASK_OWNERSHIP_AND_FOLIAGE_SETTINGS = gql`
  fragment ProjectTaskOwnershipAndFoliageSettings on Project {
    id
    taskOwnership {
      defaultMothraTeam
      defaultMothraTeamForBreakingCommit
    }
  }
`;

export const REPO_TASK_OWNERSHIP_AND_FOLIAGE_SETTINGS = gql`
  fragment RepoTaskOwnershipAndFoliageSettings on RepoRef {
    id
    taskOwnership {
      defaultMothraTeam
      defaultMothraTeamForBreakingCommit
    }
  }
`;
