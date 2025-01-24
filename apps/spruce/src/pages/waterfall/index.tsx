import { Suspense, useRef, useState, useTransition } from "react";
import { Global, css } from "@emotion/react";
import styled from "@emotion/styled";
import Banner from "@leafygreen-ui/banner";
import Button, { Size as ButtonSize } from "@leafygreen-ui/button";
import { useParams } from "react-router-dom";
import { size } from "@evg-ui/lib/constants/tokens";
import { useWaterfallAnalytics } from "analytics";
import FilterBadges, {
  useFilterBadgeQueryParams,
} from "components/FilterBadges";
import { navBarHeight } from "components/styles/Layout";
import { WalkthroughGuideCueRef } from "components/WalkthroughGuideCue";
import { slugs } from "constants/routes";
import { WaterfallPagination } from "gql/generated/types";
import { useIsScrollAtTop, useSpruceConfig } from "hooks";
import { jiraLinkify } from "utils/string";
import { WaterfallFilterOptions } from "./types";
import WaterfallErrorBoundary from "./WaterfallErrorBoundary";
import { WaterfallFilters } from "./WaterfallFilters";
import { WaterfallGrid } from "./WaterfallGrid";
import WaterfallSkeleton from "./WaterfallSkeleton";

const Waterfall: React.FC = () => {
  const { [slugs.projectIdentifier]: projectIdentifier } = useParams();
  const spruceConfig = useSpruceConfig();
  const jiraHost = spruceConfig?.jira?.host;
  const [, startTransition] = useTransition();
  const { badges, handleClearAll, handleOnRemove } = useFilterBadgeQueryParams(
    new Set([WaterfallFilterOptions.BuildVariant, WaterfallFilterOptions.Task]),
  );

  const { sendEvent } = useWaterfallAnalytics();

  const [pagination, setPagination] = useState<WaterfallPagination>();

  const pageWrapperRef = useRef<HTMLDivElement>(null);
  const { atTop } = useIsScrollAtTop(pageWrapperRef, 200);

  const guideCueRef = useRef<WalkthroughGuideCueRef>(null);

  return (
    <>
      <Global styles={navbarStyles} />
      <PageContainer ref={pageWrapperRef} data-cy="waterfall-page">
        <Banner>
          <BannerContent>
            <div>
              <strong>Thanks for using the Waterfall Alpha!</strong> Feedback?
              Open a ticket within the project epic{" "}
              {jiraLinkify("DEVPROD-3976", jiraHost ?? "")}.
            </div>
            <Button
              onClick={() => guideCueRef.current?.restart()}
              size={ButtonSize.XSmall}
            >
              Restart walkthrough
            </Button>
          </BannerContent>
        </Banner>
        <WaterfallFilters
          // Using a key rerenders the filter components so that uncontrolled components can compute a new initial state
          key={projectIdentifier}
          pagination={pagination}
          projectIdentifier={projectIdentifier ?? ""}
        />
        <FilterBadges
          badges={badges}
          onClearAll={() => {
            sendEvent({ name: "Deleted all filter badges" });
            startTransition(handleClearAll);
          }}
          onRemove={(b) => {
            sendEvent({ name: "Deleted one filter badge" });
            startTransition(() => handleOnRemove(b));
          }}
        />
        <Suspense fallback={<WaterfallSkeleton />}>
          <WaterfallErrorBoundary projectIdentifier={projectIdentifier ?? ""}>
            <WaterfallGrid
              key={projectIdentifier}
              atTop={atTop}
              guideCueRef={guideCueRef}
              projectIdentifier={projectIdentifier ?? ""}
              setPagination={setPagination}
            />
          </WaterfallErrorBoundary>
        </Suspense>
      </PageContainer>
    </>
  );
};

const BannerContent = styled.div`
  display: flex;
  justify-content: space-between;
`;

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${size.s};
  padding: ${size.m};
  // Setting overflow-x allows floating content to be correctly positioned on the page.
  overflow-x: hidden;
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

export default Waterfall;
