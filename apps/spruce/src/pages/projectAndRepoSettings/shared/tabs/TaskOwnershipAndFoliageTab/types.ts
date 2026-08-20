import { ProjectType } from "../utils";

export interface TaskOwnershipAndFoliageFormState {
  taskOwnership: {
    dummyPlaceholder: string;
  };
}

export type TabProps = {
  projectData?: TaskOwnershipAndFoliageFormState;
  projectType: ProjectType;
  repoData?: TaskOwnershipAndFoliageFormState;
};
