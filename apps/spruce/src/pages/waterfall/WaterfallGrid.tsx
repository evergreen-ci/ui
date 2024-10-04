import { useSuspenseQuery } from "@apollo/client";
import styled from "@emotion/styled";
import { WaterfallQuery, WaterfallQueryVariables } from "gql/generated/types";
import { WATERFALL } from "gql/queries";
import { BuildRow } from "./BuildRow";
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
  const { data } = useSuspenseQuery<WaterfallQuery, WaterfallQueryVariables>(
    WATERFALL,
    {
      variables: {
        options: {
          projectIdentifier,
          limit: VERSION_LIMIT,
        },
      },
    },
  );

  return (
    <Container>
      <Row>
        <BuildVariantTitle />
        <Versions data-cy="version-labels">
          {data.waterfall.versions.map(({ inactiveVersions, version }, i) =>
            version ? (
              <VersionLabel key={version.id} {...version} />
            ) : (
              <InactiveVersion
                key={inactiveVersions?.[0]?.id ?? i} // eslint-disable-line react/no-array-index-key
                data-cy="inactive-label"
              >
                inactive
              </InactiveVersion>
            ),
          )}
        </Versions>
      </Row>
      {data.waterfall.buildVariants.map((b) => (
        <BuildRow
          key={b.id}
          build={b}
          projectIdentifier={projectIdentifier}
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
