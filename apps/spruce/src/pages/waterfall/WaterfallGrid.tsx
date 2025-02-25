import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import { useSuspenseQuery } from "@apollo/client";
import styled from "@emotion/styled";
import { fromZonedTime } from "date-fns-tz";
import { size, transitionDuration } from "@evg-ui/lib/constants/tokens";
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
import { useAdminBetaFeatures, useUserTimeZone } from "hooks";
import { useDimensions } from "hooks/useDimensions";
import { useQueryParams, useQueryParam } from "hooks/useQueryParam";
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
import { groupBuildVariants } from "./utils";
import { VersionLabel, VersionLabelView } from "./VersionLabel";

const resetFilterState: Pick<WaterfallOptions, "requesters" | "variants"> = {
  requesters: null,
  variants: null,
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
  const { adminBetaSettings } = useAdminBetaFeatures();
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

  const [serverFilters, setServerFilters] =
    useState<Pick<WaterfallOptions, "requesters" | "variants">>(
      resetFilterState,
    );

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

  useEffect(() => {
    setPagination(data.waterfall.pagination);
  }, [setPagination, data.waterfall.pagination]);

  const refEl = useRef<HTMLDivElement>(null);
  const { height } = useDimensions<HTMLDivElement>(refEl);

  const groupedBuildVariants = groupBuildVariants(
    data.waterfall.flattenedVersions,
  );

  const { activeVersionIds, buildVariants, versions } = useFilters({
    activeVersionIds: data.waterfall.pagination.activeVersionIds,
    buildVariants: groupedBuildVariants,
    flattenedVersions: data.waterfall.flattenedVersions.map(
      ({ waterfallBuilds, ...restOfVersion }) => restOfVersion,
    ),
    pins,
  });

  const [isPending, startTransition] = useTransition();
  const [allQueryParams] = useQueryParams();

  useEffect(() => {
    const serverQueryParamsEmpty =
      !Object.keys(allQueryParams).includes(
        WaterfallFilterOptions.Requesters,
      ) &&
      !Object.keys(allQueryParams).includes(
        WaterfallFilterOptions.BuildVariant,
      );
    if (activeVersionIds.length < VERSION_LIMIT && !serverQueryParamsEmpty) {
      const filters = {
        variants: allQueryParams.buildVariants as string[],
        requesters: allQueryParams.requesters as string[],
      };
      startTransition(() => {
        setServerFilters(filters);
      });
      /* refetch({
        options: {
          projectIdentifier,
          ...filters,
        },
      }); */
    } else if (serverQueryParamsEmpty) {
      startTransition(() => {
        setServerFilters(resetFilterState);
      });
      /* refetch({
        options: {
          projectIdentifier,
          ...resetFilterState,
          limit: VERSION_LIMIT,
          maxOrder,
          minOrder,
          revision,
          date: date ? fromZonedTime(date, timezone) : undefined,
        },
      }); */
    }
  }, [allQueryParams]);

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
      {adminBetaSettings?.spruceWaterfallEnabled && (
        <OnboardingTutorial guideCueRef={guideCueRef} />
      )}
    </Container>
  );
};

const Container = styled.div``;

const StickyHeader = styled(Row)<{ atTop: boolean }>`
  position: sticky;
  top: -${size.m};
  z-index: 1;

  background: white;
  margin: 0 -${size.m};
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
