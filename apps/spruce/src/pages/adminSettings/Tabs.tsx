import styled from "@emotion/styled";
import useScrollToAnchor from "hooks/useScrollToAnchor";

export const AdminSettingsTab = () => {
  useScrollToAnchor();

  return (
    <Container>
      {/* <Routes>
        {}
      </Routes> */}
    </Container>
  );
};

const Container = styled.div`
  min-width: 600px;
  width: 60%;
`;

export default AdminSettingsTab;
