import { useSuspenseQuery } from "@apollo/client";
import styled from "@emotion/styled";
import { useParams } from "react-router-dom";
import { slugs } from "constants/routes";
import { WaterfallQuery, WaterfallQueryVariables } from "gql/generated/types";
import { WATERFALL } from "gql/queries";
import { BuildRow } from "./BuildRow";
import {
  BuildVariantTitle,
  gridGroupCss,
  InactiveVersion,
  Row,
} from "./styles";
import { VersionLabel } from "./VersionLabel";

const LIMIT = 5;

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
          limit: LIMIT,
        },
      },
    },
  );

  return (
    <Container>
      <Row>
        <BuildVariantTitle />
        <Versions data-cy="version-labels">
          {data.waterfall.versions.map(({ version }) =>
            version ? (
              <VersionLabel key={version.id} {...version} />
            ) : (
              <InactiveVersion data-cy="inactive-label">
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
