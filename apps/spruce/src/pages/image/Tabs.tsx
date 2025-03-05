import styled from "@emotion/styled";
import { Routes, Route, Navigate } from "react-router";
import { ImageTabRoutes } from "constants/routes";
import useScrollToAnchor from "hooks/useScrollToAnchor";
import { Header } from "./Header";
import { BuildInformationTab, EventLogTab } from "./tabs/index";

type ImageTabsProps = {
  imageId: string;
  currentTab: ImageTabRoutes;
};

export const ImageTabs: React.FC<ImageTabsProps> = ({
  currentTab,
  imageId,
}) => {
  useScrollToAnchor();

  return (
    <Container>
      <Header imageId={imageId} tab={currentTab} />
      <Routes>
        <Route
          element={<Navigate replace to={ImageTabRoutes.BuildInformation} />}
          path="*"
        />
        <Route
          element={<BuildInformationTab key={imageId} imageId={imageId} />}
          path={ImageTabRoutes.BuildInformation}
        />
        <Route
          element={<EventLogTab key={imageId} imageId={imageId} />}
          path={ImageTabRoutes.EventLog}
        />
      </Routes>
    </Container>
  );
};

const Container = styled.div`
  min-width: 600px;
  max-width: 75%;
`;
