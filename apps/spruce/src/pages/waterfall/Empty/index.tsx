import { BasicEmptyState } from "@leafygreen-ui/empty-state";
import { EmptyGraphic } from "./EmptyGraphic";

export const Empty: React.FC = () => (
  <BasicEmptyState
    description="Evergreen found no commits matching the applied filters."
    graphic={<EmptyGraphic />}
    title="No Results Found"
  />
);
