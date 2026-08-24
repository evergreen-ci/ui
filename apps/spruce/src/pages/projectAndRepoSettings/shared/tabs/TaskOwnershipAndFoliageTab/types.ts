import { ProjectType } from "../utils";

export interface TaskOwnershipAndFoliageFormState {
  taskOwnership: {
    mothra: {
      defaultMothraTeam: string;
      defaultMothraTeamForBreakingCommit: string;
    };
  };
}

export type TabProps = {
  projectData?: TaskOwnershipAndFoliageFormState;
  projectType: ProjectType;
  repoData?: TaskOwnershipAndFoliageFormState;
};
