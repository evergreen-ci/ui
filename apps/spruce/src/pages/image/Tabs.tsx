import styled from "@emotion/styled";
import { Routes, Route, Navigate } from "react-router-dom";
import { ImageTabRoutes } from "constants/routes";
import { EventLogTab } from "./tabs/index";

export const ImageTabs: React.FC = () => (
  <Container>
    <Routes>
      <Route
        path="/image/*/event-log"
        element={<Navigate to={ImageTabRoutes.EventLog} replace />}
      />
      <Route path={ImageTabRoutes.EventLog} element={<EventLogTab />} />
    </Routes>
  </Container>
);

const Container = styled.div`
  min-width: 600px;
  width: 60%;
`;
