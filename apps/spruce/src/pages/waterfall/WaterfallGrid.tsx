import { useCallback, useEffect, useRef, useState } from "react";
import { cx } from "@evg-ui/lib/utils/css";
import {
  parseQueryString,
  stringifyQuery,
} from "@evg-ui/lib/utils/query-string";
import { useWaterfallAnalytics } from "analytics";
import { WalkthroughGuideCueRef } from "components/WalkthroughGuideCue";
import { WATERFALL_PINNED_VARIANTS_KEY } from "constants/index";
import useIntersectionObserver from "hooks/useIntersectionObserver";
import { getObject, setObject } from "utils/localStorage";
import { BuildRow } from "./BuildRow";
import { BuildVariantProvider } from "./BuildVariantContext";
import { EmptyState } from "./EmptyState";
import { FetchMoreLoader } from "./FetchMoreLoader";
import { InactiveVersionsButton } from "./InactiveVersions";
import { OnboardingTutorial } from "./OnboardingTutorial";
import sharedStyles from "./styles.module.css";
import { Pagination, Version } from "./types";
import { useWaterfallData } from "./useWaterfallData";
import {
  useWaterfallNavigationTrace,
  useWaterfallTrace,
} from "./useWaterfallTrace";
import { VersionLabel, VersionLabelView } from "./VersionLabel";
import styles from "./WaterfallGrid.module.css";
import WaterfallSkeleton from "./WaterfallSkeleton";

type WaterfallGridProps = {
  guideCueRef: React.RefObject<WalkthroughGuideCueRef>;
  omitInactiveBuilds: boolean;
  projectIdentifier: string;
  setPagination: (pagination: Pagination) => void;
};

export const WaterfallGrid: React.FC<WaterfallGridProps> = ({
  guideCueRef,
  omitInactiveBuilds,
  projectIdentifier,
  setPagination,
}) => {
  const { sendEvent } = useWaterfallAnalytics();

  const headerScrollRef = useRef<HTMLDivElement>(null);
  const [showShadow, setShowShadow] = useState(false);
  useIntersectionObserver(headerScrollRef, ([entry]) => {
    setShowShadow(!entry.isIntersecting);
  });

  const [pins, setPins] = useState<string[]>(
    getObject<Record<string, string[]>>(WATERFALL_PINNED_VARIANTS_KEY)?.[
      projectIdentifier
    ] ?? [],
  );

  const handlePinBV = useCallback(
    (buildVariant: string, wasPinned: boolean) => {
      sendEvent({
        name: "Clicked pin build variant",
        action: wasPinned ? "unpinned" : "pinned",
        variant: buildVariant,
      });
      setPins((prev: string[]) => {
        if (wasPinned) {
          const bvIndex = prev.indexOf(buildVariant);
          const removed = [...prev];
          removed.splice(bvIndex, 1);
          return removed;
        }
        return [...prev, buildVariant];
      });
    },
    [sendEvent, setPins],
  );

  useEffect(() => {
    const bvs = getObject(WATERFALL_PINNED_VARIANTS_KEY);
    setObject(WATERFALL_PINNED_VARIANTS_KEY, {
      ...bvs,
      [projectIdentifier]: pins,
    });
  }, [pins, projectIdentifier]);

  const {
    activeVersionIds,
    buildVariants,
    data,
    displayedOptions,
    error,
    isFetching,
    versions,
  } = useWaterfallData({
    omitInactiveBuilds,
    pins,
    projectIdentifier,
  });

  useWaterfallTrace(!!data && !error);
  useWaterfallNavigationTrace({
    data: !error && !isFetching ? data : undefined,
  });

  useEffect(() => {
    if (data && !error) {
      setPagination(data.waterfall.pagination);

      // Use replaceState to remove the query params without causing a rerender
      if (!isFetching && data.waterfall.pagination.hasPrevPage === false) {
        const {
          maxOrder: _,
          minOrder: __,
          ...remainingParams
        } = parseQueryString(window.location.search);
        const search = stringifyQuery(remainingParams);
        window.history.replaceState(
          window.history.state,
          "",
          `${window.location.pathname}${search ? `?${search}` : ""}`,
        );
      }
    }
  }, [setPagination, data, isFetching, error]);

  const firstActiveVersionId = activeVersionIds[0];
  const lastActiveVersionId = activeVersionIds[activeVersionIds.length - 1];

  const isHighlighted = (v: Version, i: number) =>
    (!!displayedOptions.revision &&
      v.revision.includes(displayedOptions.revision)) ||
    (!!displayedOptions.date && i === 0);

  if (error) {
    return null;
  }

  if (!data) {
    return <WaterfallSkeleton />;
  }

  if (!isFetching && activeVersionIds.length === 0) {
    return <EmptyState pagination={data.waterfall.pagination} />;
  }

  return (
    <div className={styles.container}>
      <div ref={headerScrollRef} />
      <div
        className={cx(sharedStyles.row, styles.stickyHeader)}
        data-show-shadow={showShadow}
        data-testid="waterfall-sticky-header"
      >
        <div className={sharedStyles.buildVariantTitle} />
        <div className={styles.versions} data-testid="version-labels">
          {versions.map(({ inactiveVersions, version }, versionIndex) => {
            if (version) {
              return (
                <VersionLabel
                  highlighted={isHighlighted(version, versionIndex)}
                  isFirstVersion={version.id === firstActiveVersionId}
                  view={VersionLabelView.Waterfall}
                  {...version}
                  key={version.id}
                />
              );
            }
            const highlightedIndex = inactiveVersions?.findIndex(
              (inactiveVersion, i) => isHighlighted(inactiveVersion, i),
            );
            return (
              <div
                key={inactiveVersions?.[0].id}
                className={sharedStyles.inactiveVersion}
              >
                <InactiveVersionsButton
                  highlightedIndex={
                    highlightedIndex !== undefined && highlightedIndex > -1
                      ? highlightedIndex
                      : undefined
                  }
                  versions={inactiveVersions ?? []}
                />
              </div>
            );
          })}
          {isFetching && <FetchMoreLoader />}
        </div>
      </div>
      <BuildVariantProvider>
        {buildVariants.map((b, i) => {
          const isPinned = pins.includes(b.id);
          return (
            <BuildRow
              key={b.id}
              build={b}
              isFirstBuild={i === 0}
              lastActiveVersionId={lastActiveVersionId}
              onPinClick={handlePinBV}
              pinned={isPinned}
              projectIdentifier={projectIdentifier}
              versions={versions}
            />
          );
        })}
      </BuildVariantProvider>
      <OnboardingTutorial guideCueRef={guideCueRef} />
    </div>
  );
};
