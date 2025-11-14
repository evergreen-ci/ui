import { Suspense, useCallback, useRef, useState } from "react";
import { Global, css } from "@emotion/react";
import styled from "@emotion/styled";
import { useParams } from "react-router-dom";
import { size } from "@evg-ui/lib/constants/tokens";
import { usePageTitle } from "@evg-ui/lib/hooks/usePageTitle";
import { useWaterfallAnalytics } from "analytics";
import { ProjectBanner, RepotrackerBanner } from "components/Banners";
import FilterChips, { useFilterChipQueryParams } from "components/FilterChips";
import { navBarHeight } from "components/styles/Layout";
import { WalkthroughGuideCueRef } from "components/WalkthroughGuideCue";
import { slugs } from "constants/routes";
import { waterfallPageContainerId } from "./constants";
import { Pagination, WaterfallFilterOptions } from "./types";
import WaterfallErrorBoundary from "./WaterfallErrorBoundary";
import { WaterfallFilters } from "./WaterfallFilters";
import { WaterfallGrid } from "./WaterfallGrid";
import WaterfallSkeleton from "./WaterfallSkeleton";

const Waterfall: React.FC = () => {
  const { [slugs.projectIdentifier]: projectIdentifier } = useParams();
  usePageTitle(`${projectIdentifier} | Waterfall`);
  const { chips, handleClearAll, handleOnRemove } = useFilterChipQueryParams(
    validQueryParams,
    urlParamToTitleMap,
  );

  const { sendEvent } = useWaterfallAnalytics();

  const [pagination, setPagination] = useState<Pagination>();

  const guideCueRef = useRef<WalkthroughGuideCueRef>(null);
  const restartWalkthrough = useCallback(
    () => guideCueRef.current?.restart(),
    [],
  );

  return (
    <>
      <Global styles={navbarStyles} />
      <PageContainer data-cy="waterfall-page" id={waterfallPageContainerId}>
        <ProjectBanner projectIdentifier={projectIdentifier ?? ""} />
        <RepotrackerBanner projectIdentifier={projectIdentifier ?? ""} />
        <WaterfallFilters
          // Using a key rerenders the filter components so that uncontrolled components can compute a new initial state
          key={projectIdentifier}
          pagination={pagination}
          projectIdentifier={projectIdentifier ?? ""}
          restartWalkthrough={restartWalkthrough}
        />
        <FilterChips
          chips={chips}
          onClearAll={() => {
            sendEvent({ name: "Deleted all filter chips" });
            handleClearAll();
          }}
          onRemove={(b) => {
            sendEvent({ name: "Deleted one filter chip" });
            handleOnRemove(b);
          }}
        />
        <Suspense fallback={<WaterfallSkeleton />}>
          <WaterfallErrorBoundary projectIdentifier={projectIdentifier ?? ""}>
            <WaterfallGrid
              key={projectIdentifier}
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

const validQueryParams = new Set([
  WaterfallFilterOptions.BuildVariant,
  WaterfallFilterOptions.Task,
]);

const urlParamToTitleMap = {
  [WaterfallFilterOptions.BuildVariant]: "Variant",
  [WaterfallFilterOptions.Task]: "Task",
};

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${size.xs};
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
