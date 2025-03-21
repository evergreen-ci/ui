export interface SingleTaskDistroFormState {
  projectTasksPairs: Array<{
    displayTitle: string;
    allowedTasks: Array<string>;
  }>;
}
