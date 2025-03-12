import styled from "@emotion/styled";
import { Spinner } from "@leafygreen-ui/loading-indicator";

export const FetchMoreLoader: React.FC = () => (
  <Container data-cy="fetch-more-loader">
    <Spinner description="Fetching..." displayOption="large-vertical" />
  </Container>
);

const Container = styled.div`
  width: fit-content;
  display: flex;
  flex-direction: column;
  min-height: 40px;
`;
