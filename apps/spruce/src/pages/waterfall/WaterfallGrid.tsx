import { useRef } from "react";
import { useSuspenseQuery } from "@apollo/client";
import styled from "@emotion/styled";
import { useParams } from "react-router-dom";
import { slugs } from "constants/routes";
import { WaterfallQuery, WaterfallQueryVariables } from "gql/generated/types";
import { WATERFALL } from "gql/queries";
import { useDimensions } from "hooks/useDimensions";
import { BuildRow } from "./BuildRow";
import { InactiveVersionsButton } from "./InactiveVersionsButton";
import {
  BuildVariantTitle,
  gridGroupCss,
  Row,
  VERSION_LIMIT,
} from "./styles";
import { VersionLabel } from "./VersionLabel";

export const WaterfallGrid: React.FC = () => {
  const { [slugs.projectIdentifier]: projectIdentifier } = useParams();

  const { data } = useSuspenseQuery<WaterfallQuery, WaterfallQueryVariables>(
    WATERFALL,
    {
      skip: !projectIdentifier,
      variables: {
        options: {
          // @ts-expect-error
          projectIdentifier,
          limit: VERSION_LIMIT,
        },
      },
    },
  );
  const refEl = useRef<HTMLDivElement>(null);
  const { height } = useDimensions(
    refEl as React.MutableRefObject<HTMLElement>,
  );
  return (
    <Container ref={refEl}>
      <Row>
        <BuildVariantTitle />
        <Versions data-cy="version-labels">
          {data.waterfall.versions.map(({ inactiveVersions, version }, i) =>
            version ? (
              <VersionLabel key={version.id} commitType="active" {...version} />
            ) : (
              <InactiveVersionsButton
                containerHeight={height}
                versions={inactiveVersions ?? []}
              />
            ),
          )}
        </Versions>
      </Row>
      {data.waterfall.buildVariants.map((b) => (
        <BuildRow
          key={b.id}
          build={b}
          projectIdentifier={projectIdentifier ?? ""}
          versions={data.waterfall.versions}
        />
      ))}
    </Container>
  );
};

const Container = styled.div``;

const Versions = styled.div`
  ${gridGroupCss}
`;
