import { useRef } from "react";
import { useSuspenseQuery } from "@apollo/client";
import styled from "@emotion/styled";
import { DEFAULT_POLL_INTERVAL } from "constants/index";
import { WaterfallQuery, WaterfallQueryVariables } from "gql/generated/types";
import { WATERFALL } from "gql/queries";
import { useDimensions } from "hooks/useDimensions";
import { useQueryParam } from "hooks/useQueryParam";
import { WaterfallFilterOptions } from "types/waterfall";
import { BuildRow } from "./BuildRow";
import { InactiveVersionsButton } from "./InactiveVersionsButton";
import { PaginationButtons } from "./PaginationButtons";
import {
  BuildVariantTitle,
  gridGroupCss,
  InactiveVersion,
  Row,
  VERSION_LIMIT,
} from "./styles";
import { VersionLabel } from "./VersionLabel";

type WaterfallGridProps = {
  projectIdentifier: string;
};

export const WaterfallGrid: React.FC<WaterfallGridProps> = ({
  projectIdentifier,
}) => {
  const [minOrder] = useQueryParam<number>(WaterfallFilterOptions.MinOrder, 0);
  const [maxOrder] = useQueryParam<number>(WaterfallFilterOptions.MaxOrder, 0);

  const { data, fetchMore } = useSuspenseQuery<
    WaterfallQuery,
    WaterfallQueryVariables
  >(WATERFALL, {
    variables: {
      options: {
        projectIdentifier,
        limit: VERSION_LIMIT,
        minOrder,
        maxOrder,
      },
    },
    // @ts-expect-error pollInterval isn't officially supported by useSuspenseQuery, but it works so let's use it anyway.
    pollInterval: DEFAULT_POLL_INTERVAL,
  });

  const refEl = useRef<HTMLDivElement>(null);
  const { height } = useDimensions(
    refEl as React.MutableRefObject<HTMLElement>,
  );

  const { buildVariants, nextPageOrder, prevPageOrder, versions } =
    data.waterfall;

  return (
    <Container ref={refEl}>
      <PaginationButtons
        nextPageOrder={nextPageOrder}
        onNextPage={() =>
          fetchMore({
            variables: {
              options: {
                projectIdentifier,
                maxOrder: nextPageOrder,
              },
            },
          })
        }
        onPrevPage={() =>
          fetchMore({
            variables: {
              options: {
                projectIdentifier,
                minOrder: prevPageOrder,
              },
            },
          })
        }
        prevPageOrder={prevPageOrder}
      />
      <Row>
        <BuildVariantTitle />
        <Versions data-cy="version-labels">
          {versions.map(({ inactiveVersions, version }) =>
            version ? (
              <VersionLabel key={version.id} size="small" {...version} />
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
