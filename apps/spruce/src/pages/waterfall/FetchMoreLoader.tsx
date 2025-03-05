import styled from "@emotion/styled";
import { LightLoader } from "components/LightLoader";

export const FetchMoreLoader: React.FC = () => (
  <Container data-cy="fetch-more-loader">
    <div>Fetching...</div>
    <LightLoader />
  </Container>
);

const Container = styled.div`
  width: fit-content;
  display: flex;
  flex-direction: column;
  min-height: 40px;
`;
