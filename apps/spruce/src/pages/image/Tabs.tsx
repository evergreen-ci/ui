import styled from "@emotion/styled";
import { Routes, Route, Navigate } from "react-router-dom";
import { ImageTabRoutes } from "constants/routes";
import useScrollToAnchor from "hooks/useScrollToAnchor";
import { Header } from "./Header";
import { BuildInformationTab } from "./tabs/index";

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
          path="*"
          element={<Navigate to={ImageTabRoutes.BuildInformation} replace />}
        />
        <Route
          path={ImageTabRoutes.BuildInformation}
          element={<BuildInformationTab imageId={imageId} />}
        />
      </Routes>
    </Container>
  );
};

const Container = styled.div`
  min-width: 600px;
  width: 60%;
`;
