import {
  useCallback,
  useDeferredValue,
  useEffect,
  useRef,
  useState,
  useTransition,
} from "react";
import { useSuspenseQuery } from "@apollo/client/react";
import styled from "@emotion/styled";
import { size, transitionDuration } from "@evg-ui/lib/constants/tokens";
import { useQueryParam, useQueryParams } from "@evg-ui/lib/hooks";
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
import { useDimensions } from "hooks/useDimensions";
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
import {
  BuildVariantTitle,
  gridGroupCss,
  InactiveVersion,
  Row,
} from "./styles";
import { Pagination, WaterfallFilterOptions, Version } from "./types";
import { useFilters } from "./useFilters";
import { useWaterfallTrace } from "./useWaterfallTrace";
import { VersionLabel, VersionLabelView } from "./VersionLabel";

type ServerFilters = Pick<
  WaterfallOptions,
  "requesters" | "statuses" | "tasks" | "variants"
>;

type WaterfallGridProps = {
  projectIdentifier: string;
  setPagination: (pagination: Pagination) => void;
  guideCueRef: React.RefObject<WalkthroughGuideCueRef>;
};

export const WaterfallGrid: React.FC<WaterfallGridProps> = ({
  guideCueRef,
  projectIdentifier,
  setPagination,
}) => {
  useWaterfallTrace();
  const [queryParams, setQueryParams] = useQueryParams();
  const { sendEvent } = useWaterfallAnalytics();

  const headerScrollRef = useRef<HTMLDivElement>(null);
  const [showShadow, setShowShadow] = useState(false);
  useIntersectionObserver(headerScrollRef, ([entry]) => {
    setShowShadow(!entry.isIntersecting);
  });

  const [pins, setPins] = useState<string[]>(
    getObject(WATERFALL_PINNED_VARIANTS_KEY)?.[projectIdentifier] ?? [],
  );

  const handlePinBV = useCallback(
    (buildVariant: string, wasPinned: boolean) => () => {
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
    [sendEvent],
  );

  useEffect(() => {
    const bvs = getObject(WATERFALL_PINNED_VARIANTS_KEY);
    setObject(WATERFALL_PINNED_VARIANTS_KEY, {
      ...bvs,
      [projectIdentifier]: pins,
    });
  }, [pins, projectIdentifier]);

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
  const [maxOrder] = useQueryParam<number>(WaterfallFilterOptions.MaxOrder, 0);
  const [minOrder] = useQueryParam<number>(WaterfallFilterOptions.MinOrder, 0);
  const [revision] = useQueryParam<string | null>(
    WaterfallFilterOptions.Revision,
    null,
  );

  const [date] = useQueryParam<string>(WaterfallFilterOptions.Date, "");
  const timezone = useUserTimeZone() ?? utcTimeZone;
  const utcDate = getUTCEndOfDay(date, timezone);

  // Initialize serverFilters from query params to avoid double query
  const getServerFiltersFromParams = () => ({
    requesters,
    statuses,
    tasks,
    variants,
  });

  const [serverFilters, setServerFilters] = useState<ServerFilters>(
    getServerFiltersFromParams,
  );
  const serverParams = useDeferredValue(serverFilters);

  const { data, dataState } = useSuspenseQuery<
    WaterfallQuery,
    WaterfallQueryVariables
  >(WATERFALL, {
    variables: {
      options: {
        projectIdentifier,
        limit: VERSION_LIMIT,
        maxOrder,
        minOrder,
        revision,
        date: utcDate,
        ...serverParams,
      },
    },
    // @ts-expect-error pollInterval isn't officially supported by useSuspenseQuery, but it works so let's use it anyway.
    pollInterval: DEFAULT_POLL_INTERVAL,
    nextFetchPolicy: "cache-and-network",
  });
  // TODO DEVPROD-26717: This can be removed if the invalid arguments are fixed in useSuspenseQuery.
  const dataIsComplete = dataState === "complete";

  // Erase any order query params if we've reached the first page.
  useEffect(() => {
    if (dataIsComplete && minOrder > 0) {
      const { flattenedVersions, pagination } = data.waterfall;
      const activeVersions = pagination.activeVersionIds;
      const isMostRecentCommitOnPage =
        flattenedVersions[0].order === pagination.mostRecentVersionOrder;

      if (activeVersions.length < VERSION_LIMIT || isMostRecentCommitOnPage) {
        setQueryParams({
          ...queryParams,
          [WaterfallFilterOptions.MaxOrder]: undefined,
          [WaterfallFilterOptions.MinOrder]: undefined,
        });
      }
    }
  }, [dataIsComplete, data?.waterfall, minOrder, queryParams, setQueryParams]);

  useEffect(() => {
    if (dataIsComplete) {
      setPagination(data.waterfall.pagination);
    }
  }, [setPagination, dataIsComplete, data?.waterfall?.pagination]);

  const refEl = useRef<HTMLDivElement>(null);
  const { height } = useDimensions<HTMLDivElement>(refEl);

  const { activeVersionIds, buildVariants, versions } = useFilters({
    activeVersionIds: dataIsComplete
      ? data.waterfall.pagination.activeVersionIds
      : [],
    flattenedVersions: dataIsComplete ? data.waterfall.flattenedVersions : [],
    pins,
  });

  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const newFilters = getServerFiltersFromParams();
    const hasServerParams = Object.values(newFilters).some((f) => f.length > 0);

    // Only apply server filters if we have server params and need more results
    // Otherwise, use client-side filtering
    if (activeVersionIds.length < VERSION_LIMIT && hasServerParams) {
      startTransition(() => {
        setServerFilters(newFilters);
      });
    } else if (!hasServerParams) {
      startTransition(() => {
        setServerFilters((prev) =>
          Object.values(prev).every((f) => f?.length === 0) ? prev : newFilters,
        );
      });
    }
  }, [activeVersionIds.length, requesters, statuses, tasks, variants]); // eslint-disable-line react-hooks/exhaustive-deps

  const firstActiveVersionId = activeVersionIds[0];
  const lastActiveVersionId = activeVersionIds[activeVersionIds.length - 1];

  const isHighlighted = (v: Version, i: number) =>
    (revision !== null && v.revision.includes(revision)) || (!!date && i === 0);

  if (
    dataIsComplete &&
    data?.waterfall?.pagination?.activeVersionIds?.length === 0
  ) {
    return <EmptyState />;
  }

  return (
    <Container ref={refEl}>
      <div ref={headerScrollRef} />
      <StickyHeader showShadow={showShadow}>
        <BuildVariantTitle />
        <Versions data-cy="version-labels">
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
                  containerHeight={height}
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
          {isPending && <FetchMoreLoader />}
        </Versions>
      </StickyHeader>
      <BuildVariantProvider>
        {buildVariants.map((b, i) => {
          const isPinned = pins.includes(b.id);
          return (
            <BuildRow
              key={b.id}
              build={b}
              handlePinClick={handlePinBV(b.id, isPinned)}
              isFirstBuild={i === 0}
              lastActiveVersionId={lastActiveVersionId}
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

const Container = styled.div``;

const StickyHeader = styled(Row)<{ showShadow: boolean }>`
  position: sticky;
  top: -${size.m};
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
