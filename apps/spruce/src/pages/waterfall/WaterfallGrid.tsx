import { useEffect, useRef } from "react";
import { useSuspenseQuery } from "@apollo/client";
import styled from "@emotion/styled";
import { DEFAULT_POLL_INTERVAL } from "constants/index";
import {
  WaterfallPagination,
  WaterfallQuery,
  WaterfallQueryVariables,
} from "gql/generated/types";
import { WATERFALL } from "gql/queries";
import { useDimensions } from "hooks/useDimensions";
import { useQueryParam } from "hooks/useQueryParam";
import { WaterfallFilterOptions } from "types/waterfall";
import { BuildRow } from "./BuildRow";
import { InactiveVersionsButton } from "./InactiveVersions";
import {
  BuildVariantTitle,
  gridGroupCss,
  InactiveVersion,
  Row,
  VERSION_LIMIT,
} from "./styles";
import { useFilters } from "./useFilters";
import { useWaterfallTrace } from "./useWaterfallTrace";
import { groupInactiveVersions } from "./utils";
import { VersionLabel, VersionLabelView } from "./VersionLabel";

type WaterfallGridProps = {
  projectIdentifier: string;
  setPagination: (pagination: WaterfallPagination) => void;
};

export const WaterfallGrid: React.FC<WaterfallGridProps> = ({
  projectIdentifier,
  setPagination,
}) => {
  const [maxOrder] = useQueryParam<number>(WaterfallFilterOptions.MaxOrder, 0);
  const [minOrder] = useQueryParam<number>(WaterfallFilterOptions.MinOrder, 0);
  useWaterfallTrace();

  const { data } = useSuspenseQuery<WaterfallQuery, WaterfallQueryVariables>(
    WATERFALL,
    {
      variables: {
        options: {
          projectIdentifier,
          limit: VERSION_LIMIT,
          maxOrder,
          minOrder,
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
  const { height } = useDimensions(
    refEl as React.MutableRefObject<HTMLElement>,
  );

  const groupedVersions = groupInactiveVersions(
    data.waterfall.flattenedVersions,
  );

  const { buildVariants, versions } = useFilters({
    buildVariants: data.waterfall.buildVariants,
    versions: groupedVersions,
  });

  return (
    <Container ref={refEl}>
      <Row>
        <BuildVariantTitle />
        <Versions data-cy="version-labels">
          {versions.map(({ inactiveVersions, version }) =>
            version ? (
              <VersionLabel
                key={version.id}
                view={VersionLabelView.Waterfall}
                {...version}
              />
            ) : (
              <InactiveVersion key={inactiveVersions?.[0].id}>
                <InactiveVersionsButton
                  containerHeight={height}
                  versions={inactiveVersions ?? []}
                />
              </InactiveVersion>
            ),
          )}
        </Versions>
      </Row>
      {buildVariants.map((b) => (
        <BuildRow
          key={b.id}
          build={b}
          projectIdentifier={projectIdentifier}
          versions={versions}
        />
      ))}
    </Container>
  );
};

const Container = styled.div``;

const Versions = styled.div`
  ${gridGroupCss}
`;
