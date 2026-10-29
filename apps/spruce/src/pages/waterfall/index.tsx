import { Suspense, useCallback, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { usePageTitle } from "@evg-ui/lib/hooks/usePageTitle";
import { useWaterfallAnalytics } from "analytics";
import { ProjectBanner, RepotrackerBanner } from "components/Banners";
import FilterChips, { useFilterChipQueryParams } from "components/FilterChips";
import { WalkthroughGuideCueRef } from "components/WalkthroughGuideCue";
import { OMIT_INACTIVE_WATERFALL_BUILDS } from "constants/cookies";
import { slugs } from "constants/routes";
import { waterfallPageContainerId } from "./constants";
import styles from "./index.module.css";
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

  const [omitInactiveBuilds, setOmitInactiveBuilds] = useState(
    localStorage.getItem(OMIT_INACTIVE_WATERFALL_BUILDS) === "true",
  );

  const guideCueRef = useRef<WalkthroughGuideCueRef>(null);
  const restartWalkthrough = useCallback(
    () => guideCueRef.current?.restart(),
    [],
  );

  return (
    <div
      className={styles.pageContainer}
      data-testid="waterfall-page"
      id={waterfallPageContainerId}
    >
      <ProjectBanner projectIdentifier={projectIdentifier ?? ""} />
      <RepotrackerBanner projectIdentifier={projectIdentifier ?? ""} />
      <WaterfallFilters
        // Using a key rerenders the filter components so that uncontrolled components can compute a new initial state
        key={projectIdentifier}
        omitInactiveBuilds={omitInactiveBuilds}
        pagination={pagination}
        projectIdentifier={projectIdentifier ?? ""}
        restartWalkthrough={restartWalkthrough}
        setOmitInactiveBuilds={setOmitInactiveBuilds}
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
            omitInactiveBuilds={omitInactiveBuilds}
            projectIdentifier={projectIdentifier ?? ""}
            setPagination={setPagination}
          />
        </WaterfallErrorBoundary>
      </Suspense>
    </div>
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

export default Waterfall;
