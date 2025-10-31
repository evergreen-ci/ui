import { Spinner } from "@leafygreen-ui/loading-indicator";
import { Description } from "@leafygreen-ui/typography";

export const FetchMoreLoader: React.FC = () => (
  <div data-cy="fetch-more-loader">
    <Spinner size="large" />
    <Description>Fetching…</Description>
  </div>
);
