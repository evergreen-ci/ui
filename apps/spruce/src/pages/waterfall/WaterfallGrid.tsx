import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import { useSuspenseQuery } from "@apollo/client/react";
import styled from "@emotion/styled";
import { size, transitionDuration } from "@evg-ui/lib/constants/tokens";
import { useQueryParam } from "@evg-ui/lib/hooks";
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
import {
  BuildVariantTitle,
  gridGroupCss,
  InactiveVersion,
  Row,
} from "./styles";
import { Pagination, Version, WaterfallFilterOptions } from "./types";
import { useFilters } from "./useFilters";
import { useWaterfallTrace } from "./useWaterfallTrace";
import { VersionLabel, VersionLabelView } from "./VersionLabel";

type ServerFilters = Pick<
  WaterfallOptions,
  "requesters" | "statuses" | "tasks" | "variants"
>;

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

  const headerScrollRef = useRef<HTMLDivElement>(null);
  const [showShadow, setShowShadow] = useState(false);
  useIntersectionObserver(headerScrollRef, ([entry]) => {
    setShowShadow(!entry.isIntersecting);
  });

  const [pins, setPins] = useState<string[]>(
    getObject(WATERFALL_PINNED_VARIANTS_KEY)?.[projectIdentifier] ?? [],
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
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

  // TODO: It would be ideal to represent serverFilters with useDeferredValue to ditch the useState/useEffect pattern.
  // However, useDeferredValue's initialState option is introduced in React 19.
  const [serverFilters, setServerFilters] =
    useState<ServerFilters>(resetFilterState);
  const serverFiltersRef = useRef(resetFilterState);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const newFilters = { requesters, statuses, tasks, variants };
    const hasFilters = Object.values(newFilters).some((f) => f.length);

    // Mount in particular can introduce a lot of useEffect calls due to different array references, so compare strictly
    const hasChanges =
      JSON.stringify(serverFiltersRef.current) !== JSON.stringify(newFilters);

    if (hasChanges) {
      serverFiltersRef.current = newFilters;
      if (hasFilters) {
        startTransition(() => {
          setServerFilters(newFilters);
        });
      } else {
        // Don't use a transition: if cached, the data will appear immediately
        // If not a skeleton will appear, which makes more sense than 'fetching more'
        setServerFilters(newFilters);
      }
    }
  }, [requesters, statuses, tasks, variants]);

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
        omitInactiveBuilds,
        revision,
        date: utcDate,
        ...serverFilters,
      },
    },
    // @ts-expect-error pollInterval isn't officially supported by useSuspenseQuery, but it works so let's use it anyway.
    pollInterval: DEFAULT_POLL_INTERVAL,
  });
  // TODO DEVPROD-26717: This can be removed if the invalid arguments are fixed in useSuspenseQuery.
  const dataIsComplete = dataState === "complete";

  useEffect(() => {
    if (dataIsComplete) {
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
  }, [setPagination, dataIsComplete, data?.waterfall?.pagination]);

  const { activeVersionIds, buildVariants, versions } = useFilters({
    activeVersionIds: dataIsComplete
      ? data.waterfall.pagination.activeVersionIds
      : [],
    flattenedVersions: dataIsComplete ? data.waterfall.flattenedVersions : [],
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
    return <EmptyState />;
  }

  return (
    <Container>
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
          {isPending && activeVersionIds.length < VERSION_LIMIT && (
            <FetchMoreLoader />
          )}
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
