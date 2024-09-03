import styled from "@emotion/styled";
import { Body, BodyProps, H2 } from "@leafygreen-ui/typography";
import { Route, Routes, useParams, Navigate } from "react-router-dom";
import {
  PreferencesTabRoutes,
  getPreferencesRoute,
  slugs,
} from "constants/routes";
import { size } from "constants/tokens";
import { CliTab } from "./preferencesTabs/CliTab";
import { NewUITab } from "./preferencesTabs/NewUITab";
import { NotificationsTab } from "./preferencesTabs/NotificationsTab";
import { ProfileTab } from "./preferencesTabs/ProfileTab";
import { PublicKeysTab } from "./preferencesTabs/PublicKeysTab";

export const PreferencesTabs: React.FC = () => {
  // @ts-expect-error: FIXME. This comment was added by an automated script.
  const { [slugs.tab]: tab } = useParams<{
    [slugs.tab]: PreferencesTabRoutes | null;
  }>();

  // @ts-expect-error: FIXME. This comment was added by an automated script.
  const { subtitle, title } = getTitle(tab);
  return (
    <>
      <TitleContainer>
        <H2 data-cy="preferences-tab-title">{title}</H2>
        {subtitle && <Subtitle>{subtitle}</Subtitle>}
      </TitleContainer>
      <Routes>
        <Route
          element={
            <Container>
              <ProfileTab />
            </Container>
          }
          path={PreferencesTabRoutes.Profile}
        />
        <Route
          element={
            <WideContainer>
              <NotificationsTab />
            </WideContainer>
          }
          path={PreferencesTabRoutes.Notifications}
        />
        <Route
          element={
            <Container>
              <CliTab />
            </Container>
          }
          path={PreferencesTabRoutes.CLI}
        />
        <Route
          element={
            <Container>
              <NewUITab />
            </Container>
          }
          path={PreferencesTabRoutes.NewUI}
        />
        <Route
          element={
            <Container>
              <PublicKeysTab />
            </Container>
          }
          path={PreferencesTabRoutes.PublicKeys}
        />
        <Route
          element={
            <Navigate
              replace
              to={getPreferencesRoute(PreferencesTabRoutes.Profile)}
            />
          }
          path="*"
        />
      </Routes>
    </>
  );
};

const getTitle = (
  tab: PreferencesTabRoutes = PreferencesTabRoutes.Profile,
): { title: string; subtitle?: string } => {
  const defaultTitle = {
    title: "Profile",
  };
  return (
    {
      [PreferencesTabRoutes.Profile]: defaultTitle,
      [PreferencesTabRoutes.Notifications]: {
        title: "Notifications",
      },
      [PreferencesTabRoutes.CLI]: {
        title: "CLI & API",
      },
      [PreferencesTabRoutes.NewUI]: {
        title: "New UI Settings",
      },
      [PreferencesTabRoutes.PublicKeys]: {
        title: "Manage Public Keys",
        subtitle: "These keys will be used to SSH into spawned hosts.",
      },
    }[tab] ?? defaultTitle
  );
};

const Container = styled.main`
  min-width: 600px;
  width: 60%;
`;

const WideContainer = styled.main`
  min-width: 600px;
  width: 90%;
`;

const TitleContainer = styled.div`
  margin-bottom: 30px;
`;

const Subtitle = styled(Body)<BodyProps>`
  padding-top: ${size.s};
`;
