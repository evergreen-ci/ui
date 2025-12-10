import { BasicEmptyState } from "@leafygreen-ui/empty-state";
import { VERSION_SEARCH_LIMIT } from "../constants";
import { EmptyGraphic } from "./EmptyGraphic";

export const Empty: React.FC = () => (
  <BasicEmptyState
    description={`Evergreen found no builds matching the applied filters in the ${VERSION_SEARCH_LIMIT} most recent commits.`}
    graphic={<EmptyGraphic />}
    title="No Results Found"
  />
);
