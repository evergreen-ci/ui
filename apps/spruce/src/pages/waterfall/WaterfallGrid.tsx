import { useCallback, useEffect, useRef, useState } from "react";
import { useSuspenseQuery } from "@apollo/client";
import styled from "@emotion/styled";
import { fromZonedTime } from "date-fns-tz";
import Cookies from "js-cookie";
import { size, transitionDuration } from "@evg-ui/lib/constants/tokens";
import { WalkthroughGuideCue } from "components/WalkthroughGuideCue";
import { SEEN_WATERFALL_ONBOARDING_TUTORIAL } from "constants/cookies";
import {
  DEFAULT_POLL_INTERVAL,
  WATERFALL_PINNED_VARIANTS_KEY,
} from "constants/index";
import { utcTimeZone } from "constants/time";
import {
  WaterfallPagination,
  WaterfallQuery,
  WaterfallQueryVariables,
  WaterfallVersionFragment,
} from "gql/generated/types";
import { WATERFALL } from "gql/queries";
import { useUserTimeZone } from "hooks";
import { useDimensions } from "hooks/useDimensions";
import { useQueryParam } from "hooks/useQueryParam";
import { getObject, setObject } from "utils/localStorage";
import { BuildRow } from "./BuildRow";
import { BuildVariantProvider } from "./BuildVariantContext";
import { VERSION_LIMIT, walkthroughSteps } from "./constants";
import { InactiveVersionsButton } from "./InactiveVersions";
import {
  BuildVariantTitle,
  gridGroupCss,
  InactiveVersion,
  Row,
} from "./styles";
import { WaterfallFilterOptions } from "./types";
import { useFilters } from "./useFilters";
import { useWaterfallTrace } from "./useWaterfallTrace";
import { VersionLabel, VersionLabelView } from "./VersionLabel";

type WaterfallGridProps = {
  atTop: boolean;
  projectIdentifier: string;
  setPagination: (pagination: WaterfallPagination) => void;
};

export const WaterfallGrid: React.FC<WaterfallGridProps> = ({
  atTop,
  projectIdentifier,
  setPagination,
}) => {
  useWaterfallTrace();

  const [guideCueOpen, setGuideCueOpen] = useState(
    Cookies.get(SEEN_WATERFALL_ONBOARDING_TUTORIAL) !== "true",
  );

  const [pins, setPins] = useState<string[]>(
    getObject(WATERFALL_PINNED_VARIANTS_KEY)?.[projectIdentifier] ?? [],
  );

  const handlePinBV = useCallback(
    (buildVariant: string) => () => {
      setPins((prev: string[]) => {
        const bvIndex = prev.indexOf(buildVariant);
        if (bvIndex > -1) {
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
        },
      },
      // @ts-expect-error pollInterval isn't officially supported by useSuspenseQuery, but it works so let's use it anyway.
      pollInterval: DEFAULT_POLL_INTERVAL,
    },
  );

  useEffect(() => {
    setPagination(data.waterfall.pagination);
  }, [setPagination, data.waterfall.pagination]);

  const refEl = useRef<HTMLDivElement>(null);
  const { height } = useDimensions<HTMLDivElement>(refEl);

  const { activeVersionIds, buildVariants, versions } = useFilters({
    buildVariants: data.waterfall.buildVariants,
    flattenedVersions: data.waterfall.flattenedVersions,
    pins,
  });

  const firstActiveVersionId = activeVersionIds[0];
  const lastActiveVersionId = activeVersionIds[activeVersionIds.length - 1];

  const isHighlighted = (v: WaterfallVersionFragment, i: number) =>
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
        </Versions>
      </StickyHeader>
      <BuildVariantProvider>
        {buildVariants.map((b, i) => (
          <BuildRow
            key={b.id}
            build={b}
            firstActiveVersionId={firstActiveVersionId}
            handlePinClick={handlePinBV(b.id)}
            isFirstBuild={i === 0}
            lastActiveVersionId={lastActiveVersionId}
            pinned={pins.includes(b.id)}
            projectIdentifier={projectIdentifier}
            versions={versions}
          />
        ))}
      </BuildVariantProvider>
      <WalkthroughGuideCue
        dataAttributeName="data-waterfall-guide-id"
        onClose={() =>
          Cookies.set(SEEN_WATERFALL_ONBOARDING_TUTORIAL, "true", {
            expires: 365,
          })
        }
        open={guideCueOpen}
        setOpen={setGuideCueOpen}
        walkthroughSteps={walkthroughSteps}
      />
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
