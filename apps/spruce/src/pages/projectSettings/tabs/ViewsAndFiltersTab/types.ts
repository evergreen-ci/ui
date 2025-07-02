import { ParsleyFilter as GQLParsleyFilter } from "gql/generated/types";
import { ProjectType } from "../utils";

interface ParsleyFilter extends GQLParsleyFilter {
  displayTitle?: string;
}

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
