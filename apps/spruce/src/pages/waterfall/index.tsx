import { Suspense, useCallback, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { usePageTitle } from "@evg-ui/lib/hooks/usePageTitle";
import { ProjectBanner, RepotrackerBanner } from "components/Banners";
import { WalkthroughGuideCueRef } from "components/WalkthroughGuideCue";
import { OMIT_INACTIVE_WATERFALL_BUILDS } from "constants/cookies";
import { slugs } from "constants/routes";
import { waterfallPageContainerId } from "./constants";
import styles from "./index.module.css";
import { Pagination } from "./types";
import WaterfallErrorBoundary from "./WaterfallErrorBoundary";
import { WaterfallFilters } from "./WaterfallFilters";
import { WaterfallGrid } from "./WaterfallGrid";
import WaterfallSkeleton from "./WaterfallSkeleton";

const Waterfall: React.FC = () => {
  const { [slugs.projectIdentifier]: projectIdentifier } = useParams();
  usePageTitle(`${projectIdentifier} | Waterfall`);

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

export default Waterfall;
