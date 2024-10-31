import { useEffect, useRef } from "react";
import { useSuspenseQuery } from "@apollo/client";
import styled from "@emotion/styled";
import { trace } from "@opentelemetry/api";
import { TRACER_NAME } from "@evg-ui/lib/analytics/utils";
import { DEFAULT_POLL_INTERVAL } from "constants/index";
import { WaterfallQuery, WaterfallQueryVariables } from "gql/generated/types";
import { WATERFALL } from "gql/queries";
import { useDimensions } from "hooks/useDimensions";
import { BuildRow } from "./BuildRow";
import { InactiveVersionsButton } from "./InactiveVersionsButton";
import {
  BuildVariantTitle,
  gridGroupCss,
  InactiveVersion,
  Row,
  VERSION_LIMIT,
} from "./styles";
import { useFilters } from "./useFilters";
import { VersionLabel } from "./VersionLabel";

type WaterfallGridProps = {
  projectIdentifier: string;
};

const tracer = trace.getTracer(TRACER_NAME);

export const WaterfallGrid: React.FC<WaterfallGridProps> = ({
  projectIdentifier,
}) => {
  let resolveRender: (v?: any) => void;
  const renderPromise = new Promise((resolve) => {
    resolveRender = resolve;
  });

  useEffect(() => {
    resolveRender();
  }, []);

  tracer.startActiveSpan("render waterfall", async (span) => {
    renderPromise.then(() => {
      span.end();
    });
  });

  const { data } = useSuspenseQuery<WaterfallQuery, WaterfallQueryVariables>(
    WATERFALL,
    {
      variables: {
        options: {
          projectIdentifier,
          limit: VERSION_LIMIT,
        },
      },
      // @ts-expect-error pollInterval isn't officially supported by useSuspenseQuery, but it works so let's use it anyway.
      pollInterval: DEFAULT_POLL_INTERVAL,
    },
  );
  const refEl = useRef<HTMLDivElement>(null);
  const { height } = useDimensions(
    refEl as React.MutableRefObject<HTMLElement>,
  );

  const { buildVariants, versions } = useFilters(data.waterfall);

  return (
    <Container ref={refEl}>
      <Row>
        <BuildVariantTitle />
        <Versions data-cy="version-labels">
          {versions.map(({ inactiveVersions, version }) =>
            version ? (
              <VersionLabel key={version.id} size="small" {...version} />
            ) : (
              <InactiveVersion>
                <InactiveVersionsButton
                  key={inactiveVersions?.[0].id}
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
