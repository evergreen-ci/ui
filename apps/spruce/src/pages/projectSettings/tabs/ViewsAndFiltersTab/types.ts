import { ProjectType } from "../utils";

type ParsleyFilter = {
  caseSensitive: boolean;
  description: string;
  displayTitle?: string;
  exactMatch: boolean;
  expression: string;
};

export interface ViewsFormState {
  parsleyFilters: ParsleyFilter[];
  repoData?: {
    parsleyFilters: ParsleyFilter[];
  };
}

export type TabProps = {
  identifier: string;
  projectData?: ViewsFormState;
  projectType: ProjectType;
  repoData?: ViewsFormState;
};
