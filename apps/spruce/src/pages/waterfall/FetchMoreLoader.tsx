import { Spinner } from "@leafygreen-ui/loading-indicator/spinner";
import { Description } from "@leafygreen-ui/typography";

export const FetchMoreLoader: React.FC = () => (
  <div data-testid="fetch-more-loader">
    <Spinner size="large" />
    <Description>Fetching…</Description>
  </div>
);
