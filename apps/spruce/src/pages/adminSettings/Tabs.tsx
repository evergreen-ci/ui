import styled from "@emotion/styled";
import useScrollToAnchor from "hooks/useScrollToAnchor";
import { GeneralTab } from "./tabs/GeneralTab/GeneralTab";

export const AdminSettingsTabs = () => {
  useScrollToAnchor();

  return (
    <Container>
      <GeneralTab />
    </Container>
  );
};

const Container = styled.div`
  min-width: 600px;
  width: 60%;
`;

export default AdminSettingsTabs;
