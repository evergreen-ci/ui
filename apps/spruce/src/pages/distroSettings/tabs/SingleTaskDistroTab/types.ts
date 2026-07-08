export interface SingleTaskDistroFormState {
  projectTasksPairs: Array<{
    displayTitle: string;
    projectId: string;
    allowedBVs: Array<string>;
    allowedTasks: Array<string>;
  }>;
}
