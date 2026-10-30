import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useQuery } from "@apollo/client/react";
import { useErrorToast, useQueryParam } from "@evg-ui/lib/hooks";
import { cx } from "@evg-ui/lib/utils/css";
import {
  parseQueryString,
  stringifyQuery,
} from "@evg-ui/lib/utils/query-string";
import { useWaterfallAnalytics } from "analytics";
import { WalkthroughGuideCueRef } from "components/WalkthroughGuideCue";
import {
  DEFAULT_POLL_INTERVAL,
  WATERFALL_PINNED_VARIANTS_KEY,
} from "constants/index";
import { utcTimeZone } from "constants/time";
import {
  WaterfallOptions,
  WaterfallQuery,
  WaterfallQueryVariables,
} from "gql/generated/types";
import { WATERFALL } from "gql/queries";
import { useUserTimeZone } from "hooks";
import useIntersectionObserver from "hooks/useIntersectionObserver";
import { getUTCEndOfDay } from "utils/date";
import { getObject, setObject } from "utils/localStorage";
import { BuildRow } from "./BuildRow";
import { BuildVariantProvider } from "./BuildVariantContext";
import { getWaterfallAnchorKey } from "./caching/utils";
import { VERSION_LIMIT } from "./constants";
import { EmptyState } from "./EmptyState";
import { FetchMoreLoader } from "./FetchMoreLoader";
import { InactiveVersionsButton } from "./InactiveVersions";
import { OnboardingTutorial } from "./OnboardingTutorial";
import sharedStyles from "./styles.module.css";
import { Pagination, Version, WaterfallFilterOptions } from "./types";
import { useFilters } from "./useFilters";
import {
  useWaterfallNavigationTrace,
  useWaterfallTrace,
} from "./useWaterfallTrace";
import { normalizeWaterfallFilters } from "./utils";
import { VersionLabel, VersionLabelView } from "./VersionLabel";
import styles from "./WaterfallGrid.module.css";
import WaterfallSkeleton from "./WaterfallSkeleton";

type WaterfallGridProps = {
  guideCueRef: React.RefObject<WalkthroughGuideCueRef>;
  omitInactiveBuilds: boolean;
  projectIdentifier: string;
  setPagination: (pagination: Pagination) => void;
};

type DisplayedWaterfall = {
  data?: WaterfallQuery;
  options: WaterfallOptions;
  applyClientFilters: boolean;
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
  const utcDate = useMemo(
    () => getUTCEndOfDay(date, timezone),
    [date, timezone],
  );

  const [requesters] = useQueryParam<string[]>(
    WaterfallFilterOptions.Requesters,
    [],
  );
  const [statuses] = useQueryParam<string[]>(
    WaterfallFilterOptions.Statuses,
    [],
  );
  const [tasks] = useQueryParam<string[]>(WaterfallFilterOptions.Task, []);
  const [variants] = useQueryParam<string[]>(
    WaterfallFilterOptions.BuildVariant,
    [],
  );

  const hasFilters = !!(
    requesters.length ||
    statuses.length ||
    tasks.length ||
    variants.length
  );
  const selectedQueryOptions = useMemo<WaterfallOptions>(
    () => ({
      ...normalizeWaterfallFilters({
        projectIdentifier,
        requesters,
        statuses,
        tasks,
        variants,
        includeAllBuildsAndTasks: !hasFilters,
        omitInactiveBuilds: omitInactiveBuilds && variants.length > 0,
      }),
      limit: VERSION_LIMIT,
      maxOrder,
      minOrder,
      revision,
      date: utcDate,
    }),
    [
      projectIdentifier,
      requesters,
      statuses,
      tasks,
      variants,
      hasFilters,
      omitInactiveBuilds,
      maxOrder,
      minOrder,
      revision,
      utcDate,
    ],
  );

  const [displayedResult, setDisplayedResult] = useState<DisplayedWaterfall>(
    () => ({
      options: {
        ...selectedQueryOptions,
        ...normalizeWaterfallFilters({ projectIdentifier }),
      },
      applyClientFilters: true,
    }),
  );
  const { data } = displayedResult;
  const pageChanged =
    getWaterfallAnchorKey({ options: displayedResult.options }) !==
    getWaterfallAnchorKey({ options: selectedQueryOptions });

  const { activeVersionIds, buildVariants, versions } = useFilters({
    activeVersionIds: data?.waterfall.pagination.activeVersionIds ?? [],
    flattenedVersions: data?.waterfall.versions ?? [],
    filters: displayedResult.applyClientFilters
      ? selectedQueryOptions
      : displayedResult.options,
    omitInactiveBuilds: displayedResult.applyClientFilters
      ? !!selectedQueryOptions.omitInactiveBuilds
      : !!displayedResult.options.omitInactiveBuilds,
    pins,
    serverFiltered: !displayedResult.applyClientFilters,
  });

  const hasMore =
    data &&
    (displayedResult.options.minOrder
      ? data.waterfall.pagination.hasPrevPage
      : data.waterfall.pagination.hasNextPage);
  const shouldFetchMore =
    displayedResult.applyClientFilters &&
    hasFilters &&
    hasMore &&
    activeVersionIds.length < VERSION_LIMIT;
  const applyClientFilters =
    displayedResult.applyClientFilters && !pageChanged && !shouldFetchMore;
  const queryOptions = applyClientFilters
    ? displayedResult.options
    : selectedQueryOptions;
  const queryChanged =
    JSON.stringify(queryOptions) !== JSON.stringify(displayedResult.options);

  const {
    data: queryData,
    dataState,
    error,
  } = useQuery<WaterfallQuery, WaterfallQueryVariables>(WATERFALL, {
    variables: { options: queryOptions },
    pollInterval: DEFAULT_POLL_INTERVAL,
    fetchPolicy: "cache-first",
    refetchWritePolicy: "merge",
  });
  useErrorToast(error, "Unable to load waterfall");

  // Update before rendering children so cache hits never flash a skeleton or stale filters.
  if (
    dataState === "complete" &&
    (queryData !== data ||
      queryChanged ||
      applyClientFilters !== displayedResult.applyClientFilters)
  ) {
    setDisplayedResult({
      data: queryData,
      options: queryOptions,
      applyClientFilters,
    });
  }

  const isFetching = shouldFetchMore || queryChanged;
  useWaterfallTrace(!!data && !pageChanged && !error);
  useWaterfallNavigationTrace({
    data: !error && !pageChanged && !isFetching ? data : undefined,
  });

  useEffect(() => {
    if (data && !pageChanged && !error) {
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
  }, [setPagination, data, pageChanged, isFetching, error]);

  const firstActiveVersionId = activeVersionIds[0];
  const lastActiveVersionId = activeVersionIds[activeVersionIds.length - 1];

  const isHighlighted = (v: Version, i: number) =>
    (!!displayedResult.options.revision &&
      v.revision.includes(displayedResult.options.revision)) ||
    (!!displayedResult.options.date && i === 0);

  if (error) {
    return null;
  }

  if (!data || pageChanged) {
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
          {isFetching && !pageChanged && <FetchMoreLoader />}
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
