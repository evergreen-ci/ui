import { useCallback, useEffect, useRef, useState } from "react";
import styled from "@emotion/styled";
import { size, transitionDuration } from "@evg-ui/lib/constants/tokens";
import { useQueryParam } from "@evg-ui/lib/hooks";
import {
  parseQueryString,
  stringifyQuery,
} from "@evg-ui/lib/utils/query-string";
import { useWaterfallAnalytics } from "analytics";
import { navBarHeight } from "components/styles/Layout";
import { WalkthroughGuideCueRef } from "components/WalkthroughGuideCue";
import { WATERFALL_PINNED_VARIANTS_KEY } from "constants/index";
import { utcTimeZone } from "constants/time";
import { useUserTimeZone } from "hooks";
import useIntersectionObserver from "hooks/useIntersectionObserver";
import { getUTCEndOfDay } from "utils/date";
import { getObject, setObject } from "utils/localStorage";
import { BuildRow } from "./BuildRow";
import { BuildVariantProvider } from "./BuildVariantContext";
import { EmptyState } from "./EmptyState";
import { FetchMoreLoader } from "./FetchMoreLoader";
import { InactiveVersionsButton } from "./InactiveVersions";
import { OnboardingTutorial } from "./OnboardingTutorial";
import {
  BuildVariantTitle,
  InactiveVersion,
  Row,
  gridGroupCss,
} from "./styles";
import { Pagination, Version, WaterfallFilterOptions } from "./types";
import { useWaterfallData } from "./useWaterfallData";
import {
  useWaterfallNavigationTrace,
  useWaterfallTrace,
} from "./useWaterfallTrace";
import { VersionLabel, VersionLabelView } from "./VersionLabel";
import WaterfallSkeleton from "./WaterfallSkeleton";

type WaterfallGridProps = {
  guideCueRef: React.RefObject<WalkthroughGuideCueRef>;
  omitInactiveBuilds: boolean;
  projectIdentifier: string;
  setPagination: (pagination: Pagination | undefined) => void;
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

  const [maxOrder] = useQueryParam<number>(WaterfallFilterOptions.MaxOrder, 0);
  const [minOrder] = useQueryParam<number>(WaterfallFilterOptions.MinOrder, 0);
  const [revision] = useQueryParam<string | null>(
    WaterfallFilterOptions.Revision,
    null,
  );
  const [date] = useQueryParam<string>(WaterfallFilterOptions.Date, "");
  const timezone = useUserTimeZone() ?? utcTimeZone;
  const utcDate = getUTCEndOfDay(date, timezone);

  const {
    activeVersionIds,
    buildVariants,
    data,
    fetchingMore,
    loading,
    settled,
    versions,
  } = useWaterfallData({
    options: {
      projectIdentifier,
      maxOrder,
      minOrder,
      omitInactiveBuilds,
      revision,
      date: utcDate,
    },
    pins,
  });
  useWaterfallTrace(!loading);
  useWaterfallNavigationTrace({
    data: settled ? data : undefined,
  });

  useEffect(() => {
    if (!settled || !data) {
      setPagination(undefined);
      return;
    }
    setPagination(data.waterfall.pagination);

    // Use replaceState to remove the query params without causing a rerender
    if (data.waterfall.pagination.hasPrevPage === false) {
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
  }, [setPagination, settled, data]);

  const firstActiveVersionId = activeVersionIds[0];
  const lastActiveVersionId = activeVersionIds[activeVersionIds.length - 1];

  const isHighlighted = (v: Version, i: number) =>
    (revision !== null && v.revision.includes(revision)) || (!!date && i === 0);

  if (loading) {
    return <WaterfallSkeleton />;
  }

  if (settled && data && activeVersionIds.length === 0) {
    return <EmptyState pagination={data.waterfall.pagination} />;
  }

  return (
    <Container>
      <div ref={headerScrollRef} />
      <StickyHeader showShadow={showShadow}>
        <BuildVariantTitle />
        <Versions data-testid="version-labels">
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
              <InactiveVersion key={inactiveVersions?.[0].id}>
                <InactiveVersionsButton
                  highlightedIndex={
                    highlightedIndex !== undefined && highlightedIndex > -1
                      ? highlightedIndex
                      : undefined
                  }
                  versions={inactiveVersions ?? []}
                />
              </InactiveVersion>
            );
          })}
          {fetchingMore && <FetchMoreLoader />}
        </Versions>
      </StickyHeader>
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
    </Container>
  );
};

const Container = styled.div`
  overflow-y: clip;
`;

const StickyHeader = styled(Row)<{ showShadow: boolean }>`
  position: sticky;
  top: ${navBarHeight};
  z-index: 1;

  background: white;
  margin: ${size.xxs} -${size.m};
  padding: ${size.xs} ${size.m};
  ${({ showShadow }) =>
    showShadow
      ? "box-shadow: 0 4px 4px -4px rgba(0, 0, 0, 0.5);"
      : "box-shadow: unset;"}
  transition: box-shadow ${transitionDuration.default}ms ease-in-out;
`;

const Versions = styled.div`
  ${gridGroupCss}
`;
