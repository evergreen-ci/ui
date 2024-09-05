import { useEffect, useMemo } from "react";
import styled from "@emotion/styled";
import { useParams, Routes, Route, Navigate } from "react-router-dom";
import { DistroSettingsTabRoutes, slugs } from "constants/routes";
import { DistroQuery } from "gql/generated/types";
import useScrollToAnchor from "hooks/useScrollToAnchor";
import { useDistroSettingsContext } from "./Context";
import { Header } from "./Header";
import { NavigationModal } from "./NavigationModal";
import {
  EventLogTab,
  GeneralTab,
  HostTab,
  ProjectTab,
  ProviderTab,
  TaskTab,
} from "./tabs/index";
import { gqlToFormMap } from "./tabs/transformers";
import { FormStateMap } from "./tabs/types";

interface Props {
  distro: DistroQuery["distro"];
}

export const DistroSettingsTabs: React.FC<Props> = ({ distro }) => {
  const { [slugs.tab]: tab } = useParams<{
    [slugs.tab]: DistroSettingsTabRoutes;
  }>();
  const { setInitialData } = useDistroSettingsContext();

  const tabData = useMemo(() => getTabData(distro), [distro]);

  useScrollToAnchor();
  useEffect(() => {
    setInitialData(tabData);
  }, [setInitialData, tabData]);

  return (
    <Container>
      <NavigationModal />
      {/* @ts-expect-error: FIXME. This comment was added by an automated script. */}
      <Header distro={distro} tab={tab} />
      <Routes>
        <Route
          element={<Navigate replace to={DistroSettingsTabRoutes.General} />}
          path="*"
        />
        <Route
          element={
            <GeneralTab
              distroData={tabData[DistroSettingsTabRoutes.General]}
              // @ts-expect-error: FIXME. This comment was added by an automated script.
              minimumHosts={distro.hostAllocatorSettings.minimumHosts}
            />
          }
          path={DistroSettingsTabRoutes.General}
        />
        <Route
          element={
            <ProviderTab
              distro={distro}
              distroData={tabData[DistroSettingsTabRoutes.Provider]}
            />
          }
          path={DistroSettingsTabRoutes.Provider}
        />
        <Route
          element={
            <TaskTab
              distroData={tabData[DistroSettingsTabRoutes.Task]}
              // @ts-expect-error: FIXME. This comment was added by an automated script.
              provider={distro.provider}
            />
          }
          path={DistroSettingsTabRoutes.Task}
        />
        <Route
          element={
            <HostTab
              distroData={tabData[DistroSettingsTabRoutes.Host]}
              // @ts-expect-error: FIXME. This comment was added by an automated script.
              provider={distro.provider}
            />
          }
          path={DistroSettingsTabRoutes.Host}
        />
        <Route
          element={
            <ProjectTab distroData={tabData[DistroSettingsTabRoutes.Project]} />
          }
          path={DistroSettingsTabRoutes.Project}
        />
        <Route
          element={<EventLogTab />}
          path={DistroSettingsTabRoutes.EventLog}
        />
      </Routes>
    </Container>
  );
};

const getTabData = (data: Props["distro"]): FormStateMap =>
  Object.keys(gqlToFormMap).reduce(
    (obj, tab) => ({
      ...obj,
      // @ts-expect-error: FIXME. This comment was added by an automated script.
      [tab]: gqlToFormMap[tab](data),
    }),
    {} as FormStateMap,
  );

const Container = styled.div`
  min-width: 600px;
  width: 60%;
`;
