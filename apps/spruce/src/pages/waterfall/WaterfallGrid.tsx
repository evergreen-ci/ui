import { useCallback, useEffect, useRef, useState } from "react";
import { useSuspenseQuery } from "@apollo/client";
import styled from "@emotion/styled";
import { fromZonedTime } from "date-fns-tz";
import { size, transitionDuration } from "@evg-ui/lib/constants/tokens";
import {
  DEFAULT_POLL_INTERVAL,
  WATERFALL_PINNED_VARIANTS_KEY,
} from "constants/index";
import { utcTimeZone } from "constants/time";
import {
  WaterfallPagination,
  WaterfallQuery,
  WaterfallQueryVariables,
} from "gql/generated/types";
import { WATERFALL } from "gql/queries";
import { useUserTimeZone } from "hooks";
import { useDimensions } from "hooks/useDimensions";
import { useQueryParam } from "hooks/useQueryParam";
import { getObject, setObject } from "utils/localStorage";
import { BuildRow } from "./BuildRow";
import { BuildVariantProvider } from "./BuildVariantContext";
import { VERSION_LIMIT } from "./constants";
import { InactiveVersionsButton } from "./InactiveVersions";
import {
  BuildVariantTitle,
  gridGroupCss,
  InactiveVersion,
  Row,
} from "./styles";
import { Build, BuildVariant, WaterfallFilterOptions, Version } from "./types";
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

  const bvs = groupBuildVariants(data.waterfall.flattenedVersions);

  const { activeVersionIds, buildVariants, versions } = useFilters({
    buildVariants: bvs,
    flattenedVersions: data.waterfall.flattenedVersions.map(
      ({ buildVariants: bvToOmit, ...rest }) => rest,
    ),
    pins,
  });

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
        {buildVariants.map((b) => (
          <BuildRow
            key={b.id}
            build={b}
            handlePinClick={handlePinBV(b.id)}
            lastActiveVersionId={lastActiveVersionId}
            pinned={pins.includes(b.id)}
            projectIdentifier={projectIdentifier}
            versions={versions}
          />
        ))}
      </BuildVariantProvider>
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

const groupBuildVariants = (
  versions: WaterfallQuery["waterfall"]["flattenedVersions"],
): BuildVariant[] => {
  const bvMetadata: Map<string, string> = new Map();
  const bvs: Map<string, Array<Build>> = new Map();
  versions.forEach(({ buildVariants, id }) => {
    buildVariants?.forEach(({ displayName, tasks, variant }) => {
      bvMetadata.set(variant, displayName);
      if (!bvs.has(variant)) {
        bvs.set(variant, []);
      }

      const buildArr = bvs.get(variant);
      buildArr?.push({
        id: variant,
        version: id,
        tasks: tasks ?? [],
      });
    });
  });

  const arr: BuildVariant[] = Array.from(bvs)
    .map(([variant, builds]) => ({
      displayName: bvMetadata.get(variant) ?? "",
      id: variant,
      builds,
    }))
    .sort((a, b) => a.displayName.localeCompare(b.displayName));

  return arr;
};
