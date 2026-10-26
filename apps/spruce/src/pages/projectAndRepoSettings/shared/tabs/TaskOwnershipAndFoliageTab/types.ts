import { ProjectType } from "../utils";

export interface TaskOwnershipAndFoliageFormState {
  mothra: {
    defaultMothraTeam: string;
    defaultMothraTeamForBreakingCommit: string;
  };
  tagValidation: {
    tagValidationPrefix: string;
    trackTagValidation: boolean | null;
    blockOnTagValidation: boolean | null;
  };
}

export type TabProps = {
  projectData?: TaskOwnershipAndFoliageFormState;
  projectType: ProjectType;
  repoData?: TaskOwnershipAndFoliageFormState;
};
