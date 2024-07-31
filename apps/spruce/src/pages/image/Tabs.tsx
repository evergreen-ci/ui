import styled from "@emotion/styled";
import { useParams, Routes, Route, Navigate } from "react-router-dom";
import { ImageTabRoutes, slugs } from "constants/routes";
import { Header } from "./Header";
import { BuildInformationTab } from "./tabs/index";

export const ImageTabs: React.FC = () => {
  const { [slugs.tab]: tab } = useParams<{
    [slugs.tab]: ImageTabRoutes;
  }>();

  return (
    <Container>
      {/* @ts-expect-error: FIXME */}
      <Header tab={tab} />
      <Routes>
        <Route
          path="*"
          element={<Navigate to={ImageTabRoutes.BuildInformation} replace />}
        />
        <Route
          path={ImageTabRoutes.BuildInformation}
          element={<BuildInformationTab />}
        />
      </Routes>
    </Container>
  );
};

const Container = styled.div`
  min-width: 600px;
  width: 60%;
`;
