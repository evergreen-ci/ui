export interface SingleTaskDistroFormState {
  projectTasksPairs: Array<{
    displayTitle: string;
    projectId: string;
    isRegex: boolean;
    allowedBVs: Array<string>;
    allowedTasks: Array<string>;
  }>;
}
