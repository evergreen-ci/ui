import { Suspense } from "react";
import { Global, css } from "@emotion/react";
import styled from "@emotion/styled";
import Banner from "@leafygreen-ui/banner";
import { TableSkeleton } from "@leafygreen-ui/skeleton-loader";
import { useParams } from "react-router-dom";
import { useWaterfallAnalytics } from "analytics";
import FilterBadges, {
  useFilterBadgeQueryParams,
} from "components/FilterBadges";
import { navBarHeight } from "components/Header/Navbar";
import { slugs } from "constants/routes";
import { size } from "constants/tokens";
import { useSpruceConfig } from "hooks";
import { WaterfallFilterOptions } from "types/waterfall";
import { isBeta } from "utils/environmentVariables";
import { jiraLinkify } from "utils/string";
import { VERSION_LIMIT } from "./styles";
import { WaterfallFilters } from "./WaterfallFilters";
import { WaterfallGrid } from "./WaterfallGrid";

const Waterfall: React.FC = () => {
  const { [slugs.projectIdentifier]: projectIdentifier } = useParams();
  const spruceConfig = useSpruceConfig();
  const jiraHost = spruceConfig?.jira?.host;

  const { badges, handleClearAll, handleOnRemove } = useFilterBadgeQueryParams(
    new Set([WaterfallFilterOptions.BuildVariant]),
  );

  const { sendEvent } = useWaterfallAnalytics();

  return (
    <>
      <Global styles={navbarStyles} />
      <PageContainer data-cy="waterfall-page">
        {isBeta() && (
          <Banner>
            <strong>Thanks for using the Waterfall Alpha!</strong> Feedback?
            Open a ticket within the project epic{" "}
            {jiraLinkify("DEVPROD-3976", jiraHost ?? "")}.
          </Banner>
        )}
        <WaterfallFilters
          // Using a key rerenders the filter components so that uncontrolled components can compute a new initial state
          key={projectIdentifier}
          projectIdentifier={projectIdentifier ?? ""}
        />
        <BadgeWrapper>
          <FilterBadges
            badges={badges}
            onClearAll={() => {
              sendEvent({ name: "Deleted all filter badges" });
              handleClearAll();
            }}
            onRemove={(b) => {
              sendEvent({ name: "Deleted one filter badge" });
              handleOnRemove(b);
            }}
          />
        </BadgeWrapper>
        {/* TODO DEVPROD-11708: Use dynamic column limit in skeleton */}
        <Suspense
          fallback={<TableSkeleton numCols={VERSION_LIMIT + 1} numRows={15} />}
        >
          <WaterfallGrid projectIdentifier={projectIdentifier ?? ""} />
        </Suspense>
      </PageContainer>
    </>
  );
};

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${size.s};
  padding: ${size.m} ${size.l};
`;

/* Safari performance of the waterfall chokes if using overflow-y: scroll, so we need the page to scroll instead.
    Update navbar layout to accommodate this. */
const navbarStyles = css`
  header {
    position: unset !important;
  }
  #banner-container {
    padding-top: ${navBarHeight};
  }
  nav {
    position: fixed !important;
    width: 100%;
    z-index: 1;
  }
`;

const BadgeWrapper = styled.div`
  margin: ${size.s} 0;
`;

export default Waterfall;
