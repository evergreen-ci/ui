import { useSuspenseQuery } from "@apollo/client";
import styled from "@emotion/styled";
import { useParams } from "react-router-dom";
import { slugs } from "constants/routes";
import { WaterfallQuery, WaterfallQueryVariables } from "gql/generated/types";
import { WATERFALL } from "gql/queries";
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
        <div /> {/* Placeholder div for the build variant label column */}
        {data.waterfall.versions.map(({ version }) =>
          version ? <VersionLabel key={version.id} {...version} /> : null,
        )}
      </Row>
    </Container>
  );
};

const Container = styled.div`
  display: grid;
  grid-template-columns: repeat(${LIMIT + 1}, minmax(0, 1fr));
  gap: 12px;
`;

const Row = styled.div`
  display: grid;
  grid-column: 1/-1;
  grid-template-columns: subgrid;
`;
