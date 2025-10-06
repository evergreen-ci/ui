import { ProjectType } from "../utils";

export interface TestSelectionFormState {
  allowed: boolean | null;
  defaultEnabled: boolean | null;
}

export type TabProps = {
  projectData?: TestSelectionFormState;
  projectType: ProjectType;
  repoData?: TestSelectionFormState;
};
