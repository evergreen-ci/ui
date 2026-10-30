import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useTransition,
} from "react";
import { useSuspenseQuery } from "@apollo/client/react";
import { useLocation, useNavigationType } from "react-router-dom";
import { useQueryParam } from "@evg-ui/lib/hooks";
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
import {
  getWaterfallAnchorKey,
  normalizeWaterfallFilters,
} from "./caching/utils";
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
import { VersionLabel, VersionLabelView } from "./VersionLabel";
import styles from "./WaterfallGrid.module.css";

type WaterfallGridProps = {
  guideCueRef: React.RefObject<WalkthroughGuideCueRef>;
  omitInactiveBuilds: boolean;
  projectIdentifier: string;
  setPagination: (pagination: Pagination | undefined) => void;
};

type WaterfallRequest = {
  options: WaterfallOptions;
  preview: boolean;
};

export const WaterfallGrid: React.FC<WaterfallGridProps> = ({
  guideCueRef,
  omitInactiveBuilds,
  projectIdentifier,
  setPagination,
}) => {
  useWaterfallTrace();
  const { sendEvent } = useWaterfallAnalytics();
  const { key: locationKey } = useLocation();
  const navigationType = useNavigationType();
  const [navigation, setNavigation] = useState({
    key: locationKey,
    hasPopped: false,
  });
  const hasHistoryNavigation =
    navigation.hasPopped ||
    (navigation.key !== locationKey && navigationType === "POP");
  if (navigation.key !== locationKey) {
    setNavigation({
      key: locationKey,
      hasPopped: hasHistoryNavigation,
    });
  }

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
  const targetOptions = useMemo<WaterfallOptions>(
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

  const [request, setRequest] = useState<WaterfallRequest>(() => ({
    options: {
      ...targetOptions,
      ...normalizeWaterfallFilters({ projectIdentifier }),
    },
    preview: true,
  }));
  const requestKey = JSON.stringify(request);
  const requestedKeyRef = useRef(requestKey);
  const [isPending, startTransition] = useTransition();
  const pageChanged =
    getWaterfallAnchorKey({ options: request.options }) !==
    getWaterfallAnchorKey({ options: targetOptions });
  // Navigate directly so cache misses suspend, while filter updates stay deferred.
  const queryRequest = useMemo<WaterfallRequest>(
    () => (pageChanged ? { options: targetOptions, preview: false } : request),
    [pageChanged, request, targetOptions],
  );
  const [previewOptions, setPreviewOptions] = useState(targetOptions);
  if (
    request.preview &&
    !pageChanged &&
    !hasHistoryNavigation &&
    JSON.stringify(previewOptions) !== JSON.stringify(targetOptions)
  ) {
    // Retain this page's local selection while navigating to a different page.
    setPreviewOptions(targetOptions);
  }

  const { data, dataState } = useSuspenseQuery<
    WaterfallQuery,
    WaterfallQueryVariables
  >(WATERFALL, {
    variables: { options: queryRequest.options },
    // @ts-expect-error pollInterval isn't officially supported by useSuspenseQuery, but it works so let's use it anyway.
    pollInterval: DEFAULT_POLL_INTERVAL,
    fetchPolicy: "cache-first",
    refetchWritePolicy: "merge",
  });
  // TODO DEVPROD-26717: This can be removed if the invalid arguments are fixed in useSuspenseQuery.
  const dataIsComplete = dataState === "complete";

  const { activeVersionIds, buildVariants, versions } = useFilters({
    activeVersionIds: dataIsComplete
      ? data.waterfall.pagination.activeVersionIds
      : [],
    flattenedVersions: dataIsComplete ? data.waterfall.versions : [],
    filters: queryRequest.preview ? previewOptions : queryRequest.options,
    omitInactiveBuilds: queryRequest.preview
      ? !!previewOptions.omitInactiveBuilds
      : !!queryRequest.options.omitInactiveBuilds,
    pins,
    serverFiltered: !queryRequest.preview,
  });

  const hasMore =
    dataIsComplete &&
    (queryRequest.options.minOrder
      ? data.waterfall.pagination.hasPrevPage
      : data.waterfall.pagination.hasNextPage);
  const needsBackfill =
    queryRequest.preview &&
    hasFilters &&
    hasMore &&
    activeVersionIds.length < VERSION_LIMIT;
  const nextRequest = useMemo<WaterfallRequest>(
    () =>
      request.preview && !pageChanged && !hasHistoryNavigation && !needsBackfill
        ? request
        : { options: targetOptions, preview: false },
    [request, pageChanged, hasHistoryNavigation, needsBackfill, targetOptions],
  );
  const nextRequestKey = JSON.stringify(nextRequest);
  const isFetching =
    isPending || nextRequestKey !== JSON.stringify(queryRequest);

  useEffect(() => {
    if (requestedKeyRef.current !== nextRequestKey) {
      requestedKeyRef.current = nextRequestKey;
      if (pageChanged) {
        // Commit the destination after its query is ready; only filters need a transition.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setRequest({ ...nextRequest });
      } else {
        startTransition(() => {
          // A fresh update also supersedes a suspended request when filters are cleared.
          setRequest({ ...nextRequest });
        });
      }
    }
  }, [nextRequest, nextRequestKey, pageChanged]);

  useWaterfallNavigationTrace({
    data: dataIsComplete && !isFetching ? data : undefined,
  });

  useEffect(() => () => setPagination(undefined), [setPagination]);

  useEffect(() => {
    if (dataIsComplete) {
      setPagination({ ...data.waterfall.pagination, isLoading: isFetching });

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
  }, [setPagination, dataIsComplete, data?.waterfall?.pagination, isFetching]);

  const firstActiveVersionId = activeVersionIds[0];
  const lastActiveVersionId = activeVersionIds[activeVersionIds.length - 1];

  const isHighlighted = (v: Version, i: number) =>
    (!!queryRequest.options.revision &&
      v.revision.includes(queryRequest.options.revision)) ||
    (!!queryRequest.options.date && i === 0);

  if (dataIsComplete && !isFetching && activeVersionIds.length === 0) {
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
