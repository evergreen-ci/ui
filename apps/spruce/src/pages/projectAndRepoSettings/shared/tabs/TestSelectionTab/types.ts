import { ProjectType } from "../utils";

export enum TaskLevelTestSelection {
  Disabled = "disabled",
  Patches = "patches",
  PatchesAndMainline = "patches-and-mainline",
}

export interface TestSelectionFormState {
  allowed: boolean | null;
  taskLevel: TaskLevelTestSelection | null;
}

export type TabProps = {
  projectData?: TestSelectionFormState;
  projectType: ProjectType;
  repoData?: TestSelectionFormState;
};
