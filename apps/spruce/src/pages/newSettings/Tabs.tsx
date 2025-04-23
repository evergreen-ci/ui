import React, { useEffect, useMemo } from "react";
import styled from "@emotion/styled";
import { Navigate, Route, Routes, useParams } from "react-router-dom";
import { ProjectSettingsTabRoutes, slugs } from "../../constants/routes";
import {
  ProjectSettingsQuery,
  RepoSettingsQuery,
} from "../../gql/generated/types";
import useScrollToAnchor from "../../hooks/useScrollToAnchor";
import { AccessTab } from "../projectSettings/tabs/AccessTab/AccessTab";
import { ContainersTab } from "../projectSettings/tabs/ContainersTab/ContainersTab";
import { EventLogTab } from "../projectSettings/tabs/EventLogTab/EventLogTab";
import { GeneralTab } from "../projectSettings/tabs/GeneralTab/GeneralTab";
import { AppSettingsTab } from "../projectSettings/tabs/GithubAppSettingsTab/AppSettingsTab";
import { GithubCommitQueueTab } from "../projectSettings/tabs/GithubCommitQueueTab/GithubCommitQueueTab";
import { PermissionGroupsTab } from "../projectSettings/tabs/GithubPermissionGroupsTab/PermissionGroupsTab";
import { NotificationsTab } from "../projectSettings/tabs/NotificationsTab/NotificationsTab";
import { PatchAliasesTab } from "../projectSettings/tabs/PatchAliasesTab/PatchAliasesTab";
import { PeriodicBuildsTab } from "../projectSettings/tabs/PeriodicBuildsTab/PeriodicBuildsTab";
import { PluginsTab } from "../projectSettings/tabs/PluginsTab/PluginsTab";
import { ProjectTriggersTab } from "../projectSettings/tabs/ProjectTriggersTab/ProjectTriggersTab";
import { gqlToFormMap } from "../projectSettings/tabs/transformers";
import {
  FormStateMap,
  TabDataProps,
  WritableProjectSettingsType,
} from "../projectSettings/tabs/types";
import { ProjectType } from "../projectSettings/tabs/utils";
import { VariablesTab } from "../projectSettings/tabs/VariablesTab/VariablesTab";
import { ViewsAndFiltersTab } from "../projectSettings/tabs/ViewsAndFiltersTab/ViewsAndFiltersTab";
import { VirtualWorkstationTab } from "../projectSettings/tabs/VirtualWorkstationTab/VirtualWorkstationTab";
import { useNewSettingsContext } from "./Context";
import { Header } from "./Header";
import { NavigationModal } from "./NavigationModal";

type ProjectSettings = ProjectSettingsQuery["projectSettings"];
type RepoSettings = RepoSettingsQuery["repoSettings"];

interface Props {
  atTop: boolean;
  projectData?: ProjectSettings;
  projectType: ProjectType;
  repoData?: RepoSettings;
}

export const NewSettingsTabs: React.FC<Props> = ({
  atTop,
  projectData,
  projectType,
  repoData,
}) => {
  const { [slugs.tab]: tab } = useParams<{
    [slugs.tab]: ProjectSettingsTabRoutes;
  }>();
  const { setInitialData } = useNewSettingsContext();

  const projectId = projectData?.projectRef?.id;
  const repoId = repoData?.projectRef?.id;

  const tabData: TabDataProps = useMemo(
    () => getTabData(projectData, projectType, repoData),
    [projectData, projectType, repoData],
  );

  useScrollToAnchor();
  useEffect(() => {
    const projectOrRepoData: {
      [T in WritableProjectSettingsType]: FormStateMap[T];
    } = Object.entries(tabData).reduce(
      (obj, [route, val]) => ({
        ...obj,
        [route]: val.projectData ?? val.repoData,
      }),
      {} as Record<WritableProjectSettingsType, any>,
    );

    setInitialData(projectOrRepoData);
  }, [setInitialData, tabData]);

  return (
    <Container>
      <NavigationModal />
      <Header atTop={atTop} id={projectId || repoId} tab={tab} />
      <Routes>
        <Route
          element={
            <GeneralTab
              projectData={
                tabData[ProjectSettingsTabRoutes.General]?.projectData
              }
              projectId={projectId}
              projectType={projectType}
              repoData={tabData[ProjectSettingsTabRoutes.General]?.repoData}
            />
          }
          path={ProjectSettingsTabRoutes.General}
        />
        <Route
          element={
            <AccessTab
              projectData={
                tabData[ProjectSettingsTabRoutes.Access]?.projectData
              }
              projectId={projectId}
              projectType={projectType}
              repoData={tabData[ProjectSettingsTabRoutes.Access]?.repoData}
            />
          }
          path={ProjectSettingsTabRoutes.Access}
        />
        <Route
          element={
            <VariablesTab
              projectData={
                tabData[ProjectSettingsTabRoutes.Variables]?.projectData
              }
              projectId={projectId}
              projectType={projectType}
              repoData={tabData[ProjectSettingsTabRoutes.Variables]?.repoData}
            />
          }
          path={ProjectSettingsTabRoutes.Variables}
        />
        <Route
          element={
            <GithubCommitQueueTab
              projectData={
                tabData[ProjectSettingsTabRoutes.GithubCommitQueue]?.projectData
              }
              projectId={projectId}
              projectType={projectType}
              repoData={
                tabData[ProjectSettingsTabRoutes.GithubCommitQueue]?.repoData
              }
            />
          }
          path={ProjectSettingsTabRoutes.GithubCommitQueue}
        />
        <Route
          element={
            <NotificationsTab
              projectData={
                tabData[ProjectSettingsTabRoutes.Notifications]?.projectData
              }
              projectId={projectId}
              projectType={projectType}
              repoData={
                tabData[ProjectSettingsTabRoutes.Notifications]?.repoData
              }
            />
          }
          path={ProjectSettingsTabRoutes.Notifications}
        />
        <Route
          element={
            <PatchAliasesTab
              projectData={
                tabData[ProjectSettingsTabRoutes.PatchAliases]?.projectData
              }
              projectId={projectId}
              projectType={projectType}
              repoData={
                tabData[ProjectSettingsTabRoutes.PatchAliases]?.repoData
              }
            />
          }
          path={ProjectSettingsTabRoutes.PatchAliases}
        />
        <Route
          element={
            <VirtualWorkstationTab
              projectData={
                tabData[ProjectSettingsTabRoutes.VirtualWorkstation]
                  ?.projectData
              }
              projectId={projectId}
              projectType={projectType}
              repoData={
                tabData[ProjectSettingsTabRoutes.VirtualWorkstation]?.repoData
              }
            />
          }
          path={ProjectSettingsTabRoutes.VirtualWorkstation}
        />
        <Route
          element={
            <ContainersTab
              projectData={
                tabData[ProjectSettingsTabRoutes.Containers]?.projectData
              }
              projectId={projectId}
              projectType={projectType}
              repoData={tabData[ProjectSettingsTabRoutes.Containers]?.repoData}
            />
          }
          path={ProjectSettingsTabRoutes.Containers}
        />
        <Route
          element={
            <ViewsAndFiltersTab
              projectData={
                tabData[ProjectSettingsTabRoutes.ViewsAndFilters]?.projectData
              }
              projectId={projectId}
              projectType={projectType}
              repoData={
                tabData[ProjectSettingsTabRoutes.ViewsAndFilters]?.repoData
              }
            />
          }
          path={ProjectSettingsTabRoutes.ViewsAndFilters}
        />
        <Route
          element={
            <ProjectTriggersTab
              projectData={
                tabData[ProjectSettingsTabRoutes.ProjectTriggers]?.projectData
              }
              projectId={projectId}
              projectType={projectType}
              repoData={
                tabData[ProjectSettingsTabRoutes.ProjectTriggers]?.repoData
              }
            />
          }
          path={ProjectSettingsTabRoutes.ProjectTriggers}
        />
        <Route
          element={
            <PeriodicBuildsTab
              projectData={
                tabData[ProjectSettingsTabRoutes.PeriodicBuilds]?.projectData
              }
              projectId={projectId}
              projectType={projectType}
              repoData={
                tabData[ProjectSettingsTabRoutes.PeriodicBuilds]?.repoData
              }
            />
          }
          path={ProjectSettingsTabRoutes.PeriodicBuilds}
        />
        <Route
          element={
            <PluginsTab
              projectData={
                tabData[ProjectSettingsTabRoutes.Plugins]?.projectData
              }
              projectId={projectId}
              projectType={projectType}
              repoData={tabData[ProjectSettingsTabRoutes.Plugins]?.repoData}
            />
          }
          path={ProjectSettingsTabRoutes.Plugins}
        />
        <Route
          element={
            <EventLogTab
              projectData={
                tabData[ProjectSettingsTabRoutes.EventLog]?.projectData
              }
              projectId={projectId}
              projectType={projectType}
              repoData={tabData[ProjectSettingsTabRoutes.EventLog]?.repoData}
            />
          }
          path={ProjectSettingsTabRoutes.EventLog}
        />
        <Route
          element={
            <AppSettingsTab
              projectData={
                tabData[ProjectSettingsTabRoutes.GithubAppSettings]?.projectData
              }
              projectId={projectId}
              projectType={projectType}
              repoData={
                tabData[ProjectSettingsTabRoutes.GithubAppSettings]?.repoData
              }
            />
          }
          path={ProjectSettingsTabRoutes.GithubAppSettings}
        />
        <Route
          element={
            <PermissionGroupsTab
              projectData={
                tabData[ProjectSettingsTabRoutes.GithubPermissionGroups]
                  ?.projectData
              }
              projectId={projectId}
              projectType={projectType}
              repoData={
                tabData[ProjectSettingsTabRoutes.GithubPermissionGroups]
                  ?.repoData
              }
            />
          }
          path={ProjectSettingsTabRoutes.GithubPermissionGroups}
        />
        <Route
          element={<Navigate replace to={ProjectSettingsTabRoutes.General} />}
          path="*"
        />
      </Routes>
    </Container>
  );
};

/* Map data from query to the tab to which it will be passed */
const getTabData = (
  projectData?: ProjectSettings,
  projectType: ProjectType,
  repoData?: RepoSettings,
): TabDataProps => {
  if (!projectData && !repoData) {
    return {} as TabDataProps;
  }

  return Object.keys(gqlToFormMap).reduce(
    (obj, tab) => ({
      ...obj,
      [tab]: {
        projectData: projectData
          ? gqlToFormMap[tab](projectData, { projectType })
          : null,
        repoData: repoData
          ? gqlToFormMap[tab](repoData, { projectType })
          : null,
      },
    }),
    {} as TabDataProps,
  );
};

const Container = styled.div`
  min-width: 600px;
  width: 60%;
`;
