import { ProjectType } from "../utils";

export interface TaskOwnershipAndFoliageFormState {
  mothra: {
    defaultMothraTeam: string;
    defaultMothraTeamForBreakingCommit: string;
  };
  tagValidation: {
    generatedTaskValidationPrefix: string;
    trackGeneratedTaskTagValidation: boolean | null;
    blockTaskGenerationOnTagValidation: boolean | null;
  };
}

export type TabProps = {
  projectData?: TaskOwnershipAndFoliageFormState;
  projectType: ProjectType;
  repoData?: TaskOwnershipAndFoliageFormState;
};
