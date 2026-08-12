import { ProjectType } from "../utils";

export interface TestSelectionFormState {
  projectLevel: {
    allowed: boolean | null;
  };
  taskLevel: {
    defaultEnabled: boolean | null;
    mainlineDefaultEnabled: boolean | null;
  };
}

export type TabProps = {
  projectData?: TestSelectionFormState;
  projectType: ProjectType;
  repoData?: TestSelectionFormState;
};
