import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import { useSuspenseQuery } from "@apollo/client";
import styled from "@emotion/styled";
import { fromZonedTime } from "date-fns-tz";
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
import { getObject, setObject } from "utils/localStorage";
import { BuildRow } from "./BuildRow";
import { BuildVariantProvider } from "./BuildVariantContext";
import { VERSION_LIMIT } from "./constants";
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

const resetFilterState: ServerFilters = {
  requesters: undefined,
  statuses: undefined,
  tasks: undefined,
  variants: undefined,
};

type WaterfallGridProps = {
  atTop: boolean;
  projectIdentifier: string;
  setPagination: (pagination: Pagination) => void;
  guideCueRef: React.RefObject<WalkthroughGuideCueRef>;
};

export const WaterfallGrid: React.FC<WaterfallGridProps> = ({
  atTop,
  guideCueRef,
  projectIdentifier,
  setPagination,
}) => {
  useWaterfallTrace();
  const [queryParams, setQueryParams] = useQueryParams();
  const { sendEvent } = useWaterfallAnalytics();

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

  const [maxOrder] = useQueryParam<number>(WaterfallFilterOptions.MaxOrder, 0);
  const [minOrder] = useQueryParam<number>(WaterfallFilterOptions.MinOrder, 0);
  const [revision] = useQueryParam<string | null>(
    WaterfallFilterOptions.Revision,
    null,
  );
  const [date] = useQueryParam<string>(WaterfallFilterOptions.Date, "");

  const timezone = useUserTimeZone() ?? utcTimeZone;

  const [serverFilters, setServerFilters] =
    useState<ServerFilters>(resetFilterState);

  const { data } = useSuspenseQuery<WaterfallQuery, WaterfallQueryVariables>(
    WATERFALL,
    {
      variables: {
        options: {
          projectIdentifier,
          limit: VERSION_LIMIT,
          maxOrder,
          minOrder,
          revision,
          date: date ? fromZonedTime(date, timezone) : undefined,
          ...serverFilters,
        },
      },
      // @ts-expect-error pollInterval isn't officially supported by useSuspenseQuery, but it works so let's use it anyway.
      pollInterval: DEFAULT_POLL_INTERVAL,
      nextFetchPolicy: "cache-and-network",
    },
  );

  // Erase any order query params if we've reached the first page.
  useEffect(() => {
    if (minOrder > 0) {
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
  }, [data.waterfall, minOrder, queryParams, setQueryParams]);

  useEffect(() => {
    setPagination(data.waterfall.pagination);
  }, [setPagination, data.waterfall.pagination]);

  const refEl = useRef<HTMLDivElement>(null);
  const { height } = useDimensions<HTMLDivElement>(refEl);

  const { activeVersionIds, buildVariants, versions } = useFilters({
    activeVersionIds: data.waterfall.pagination.activeVersionIds,
    flattenedVersions: data.waterfall.flattenedVersions,
    pins,
  });

  const [isPending, startTransition] = useTransition();
  const [allQueryParams] = useQueryParams();

  useEffect(() => {
    const hasServerParams =
      Object.keys(allQueryParams).includes(WaterfallFilterOptions.Requesters) ||
      Object.keys(allQueryParams).includes(WaterfallFilterOptions.Statuses) ||
      Object.keys(allQueryParams).includes(WaterfallFilterOptions.Task) ||
      Object.keys(allQueryParams).includes(WaterfallFilterOptions.BuildVariant);
    if (activeVersionIds.length < VERSION_LIMIT && hasServerParams) {
      const filters = {
        requesters: allQueryParams[
          WaterfallFilterOptions.Requesters
        ] as string[],
        statuses: allQueryParams[WaterfallFilterOptions.Statuses] as string[],
        tasks: allQueryParams[WaterfallFilterOptions.Task] as string[],
        variants: allQueryParams[
          WaterfallFilterOptions.BuildVariant
        ] as string[],
      };
      startTransition(() => {
        setServerFilters(filters);
      });
    } else if (!hasServerParams) {
      // Because this data is already loaded and no animation is necessary, omitting startTransition for snappiness
      setServerFilters(resetFilterState);
    }
  }, [allQueryParams]); // eslint-disable-line react-hooks/exhaustive-deps

  const firstActiveVersionId = activeVersionIds[0];
  const lastActiveVersionId = activeVersionIds[activeVersionIds.length - 1];

  const isHighlighted = (v: Version, i: number) =>
    (revision !== null && v.revision.includes(revision)) || (!!date && i === 0);

  return (
    <Container ref={refEl}>
      <StickyHeader atTop={atTop}>
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

const StickyHeader = styled(Row)<{ atTop: boolean }>`
  position: sticky;
  top: -${size.m};
  z-index: 1;

  background: white;
  margin: ${size.xxs} -${size.m};
  padding: ${size.xs} ${size.m};
  ${({ atTop }) =>
    atTop
      ? "box-shadow: unset"
      : "box-shadow: 0 4px 4px -4px rgba(0, 0, 0, 0.5); "}
  transition: box-shadow ${transitionDuration.default}ms ease-in-out;
`;

const Versions = styled.div`
  ${gridGroupCss}
`;
