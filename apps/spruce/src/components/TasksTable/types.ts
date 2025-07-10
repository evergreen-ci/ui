export type TaskTableInfo = {
  id: string;
  aborted?: boolean;
  blocked?: boolean;
  baseTask?: {
    id: string;
    execution: number;
    displayStatus: string;
  } | null;
  buildVariant?: string;
  buildVariantDisplayName?: string | null;
  dependsOn?: Array<{ name: string }> | null;
  displayName: string;
  displayStatus: string;
  execution: number;
  executionTasksFull?: TaskTableInfo[] | null;
  projectIdentifier?: string | null;
  reviewed?: boolean | null;
};
