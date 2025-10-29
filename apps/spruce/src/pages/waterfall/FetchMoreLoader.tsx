// @ts-expect-error - LG advises directly importing from this path for simple spinners to avoid importing Lottie.
// The component works, but the export is incorrectly typed. See LG-5659.
// https://github.com/mongodb/leafygreen-ui/blob/main/packages/loading-indicator/CHANGELOG.md#major-changes
import { Spinner } from "@leafygreen-ui/loading-indicator/spinner";
import { Description } from "@leafygreen-ui/typography";

export const FetchMoreLoader: React.FC = () => (
  <div data-cy="fetch-more-loader">
    <Spinner size="large" />
    <Description>Fetching…</Description>
  </div>
);
