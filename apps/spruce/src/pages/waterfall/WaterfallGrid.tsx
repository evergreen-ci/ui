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
import { VERSION_LIMIT } from "./constants";
import { EmptyState } from "./EmptyState";
import { FetchMoreLoader } from "./FetchMoreLoader";
import { InactiveVersionsButton } from "./InactiveVersions";
import { OnboardingTutorial } from "./OnboardingTutorial";
import sharedStyles from "./styles.module.css";
import {
  Pagination,
  ServerFilters,
  Version,
  WaterfallFilterOptions,
} from "./types";
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
  setPagination: (pagination: Pagination) => void;
};

const resetFilterState: ServerFilters = {
  requesters: [],
  statuses: [],
  tasks: [],
  variants: [],
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

  const targetRequest = useMemo(
    () => ({
      locationKey,
      options: {
        projectIdentifier,
        limit: VERSION_LIMIT,
        maxOrder,
        minOrder,
        omitInactiveBuilds,
        revision,
        date: utcDate,
        requesters,
        statuses,
        tasks,
        variants,
      } satisfies WaterfallOptions,
    }),
    [
      locationKey,
      projectIdentifier,
      maxOrder,
      minOrder,
      omitInactiveBuilds,
      revision,
      utcDate,
      requesters,
      statuses,
      tasks,
      variants,
    ],
  );
  const [request, setRequest] = useState(() => ({
    ...targetRequest,
    options: { ...targetRequest.options, ...resetFilterState },
  }));
  const [isPending, startTransition] = useTransition();
  const isNavigation =
    request.options.projectIdentifier !== projectIdentifier ||
    request.options.maxOrder !== maxOrder ||
    request.options.minOrder !== minOrder ||
    request.options.revision !== revision ||
    request.options.date?.getTime() !== utcDate?.getTime() ||
    (request.locationKey !== locationKey && navigationType === "POP");

  // Navigation must suspend on a cache miss, including history moves that only change filters.
  const queryRequest = isNavigation ? targetRequest : request;
  const isFetching = isPending || queryRequest !== targetRequest;

  const { data, dataState } = useSuspenseQuery<
    WaterfallQuery,
    WaterfallQueryVariables
  >(WATERFALL, {
    variables: { options: queryRequest.options },
    // @ts-expect-error pollInterval isn't officially supported by useSuspenseQuery, but it works so let's use it anyway.
    pollInterval: DEFAULT_POLL_INTERVAL,
    nextFetchPolicy: "cache-and-network",
  });
  // TODO DEVPROD-26717: This can be removed if the invalid arguments are fixed in useSuspenseQuery.
  const dataIsComplete = dataState === "complete";

  useEffect(() => {
    if (request === targetRequest) {
      return;
    }
    if (isNavigation) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setRequest(targetRequest);
    } else {
      startTransition(() => {
        setRequest(targetRequest);
      });
    }
  }, [isNavigation, request, targetRequest]);

  useWaterfallNavigationTrace({
    data: dataIsComplete && !isFetching ? data : undefined,
  });

  useEffect(() => {
    if (dataIsComplete && !isFetching) {
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
    }
  }, [setPagination, dataIsComplete, data?.waterfall?.pagination, isFetching]);

  const { activeVersionIds, buildVariants, versions } = useFilters({
    activeVersionIds: dataIsComplete
      ? data.waterfall.pagination.activeVersionIds
      : [],
    flattenedVersions: dataIsComplete ? data.waterfall.versions : [],
    omitInactiveBuilds,
    pins,
  });

  const firstActiveVersionId = activeVersionIds[0];
  const lastActiveVersionId = activeVersionIds[activeVersionIds.length - 1];

  const isHighlighted = (v: Version, i: number) =>
    (revision !== null && v.revision.includes(revision)) || (!!date && i === 0);

  if (
    dataIsComplete &&
    data?.waterfall?.pagination?.activeVersionIds?.length === 0
  ) {
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
          {isFetching && activeVersionIds.length < VERSION_LIMIT && (
            <FetchMoreLoader />
          )}
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
