export type TaskTableInfo = {
  baseTask?: {
    id: string;
    execution: number;
    displayStatus: string;
  };
  buildVariant?: string;
  buildVariantDisplayName?: string;
  dependsOn?: Array<{ name: string }>;
  displayName: string;
  execution: number;
  executionTasksFull?: TaskTableInfo[];
  id: string;
  projectIdentifier?: string;
  displayStatus: string;
};
