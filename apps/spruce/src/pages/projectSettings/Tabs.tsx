import { useEffect, useMemo } from "react";
import styled from "@emotion/styled";
import { Navigate, Route, Routes, useParams } from "react-router-dom";
import { ProjectSettingsTabRoutes, slugs } from "constants/routes";
import { ProjectSettingsQuery, RepoSettingsQuery } from "gql/generated/types";
import useScrollToAnchor from "hooks/useScrollToAnchor";
import { useProjectSettingsContext } from "./Context";
import { Header } from "./Header";
import { NavigationModal } from "./NavigationModal";
import { AppSettingsTab } from "./tabs/GithubAppSettingsTab/AppSettingsTab";
import { PermissionGroupsTab } from "./tabs/GithubPermissionGroupsTab/PermissionGroupsTab";
import {
  AccessTab,
  ContainersTab,
  EventLogTab,
  GeneralTab,
  GithubCommitQueueTab,
  NotificationsTab,
  PatchAliasesTab,
  PeriodicBuildsTab,
  ProjectTriggersTab,
  VariablesTab,
  PluginsTab,
  ViewsAndFiltersTab,
  VirtualWorkstationTab,
} from "./tabs/index";
import { gqlToFormMap } from "./tabs/transformers";
import {
  FormStateMap,
  TabDataProps,
  WritableProjectSettingsType,
} from "./tabs/types";
import { ProjectType } from "./tabs/utils";

type ProjectSettings = ProjectSettingsQuery["projectSettings"];
type RepoSettings = RepoSettingsQuery["repoSettings"];

interface Props {
  atTop: boolean;
  projectData?: ProjectSettings;
  projectType: ProjectType;
  repoData?: RepoSettings;
}

export const ProjectSettingsTabs: React.FC<Props> = ({
  atTop,
  projectData,
  projectType,
  repoData,
}) => {
  const { [slugs.tab]: tab } = useParams<{
    [slugs.tab]: ProjectSettingsTabRoutes;
  }>();
  const { setInitialData } = useProjectSettingsContext();

  const projectId = projectData?.projectRef?.id;
  const repoId = repoData?.projectRef?.id;
  const identifier = projectData?.projectRef?.identifier;

  const tabData: TabDataProps = useMemo(
    // @ts-expect-error: FIXME. This comment was added by an automated script.
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
      <Header
        atTop={atTop}
        // @ts-expect-error: FIXME. This comment was added by an automated script.
        id={projectId || repoId}
        projectType={projectType}
        // @ts-expect-error: FIXME. This comment was added by an automated script.
        tab={tab}
      />
      <Routes>
        <Route
          element={
            <GeneralTab
              projectData={
                tabData[ProjectSettingsTabRoutes.General].projectData
              }
              projectId={projectId}
              projectType={projectType}
              repoData={tabData[ProjectSettingsTabRoutes.General].repoData}
            />
          }
          path={ProjectSettingsTabRoutes.General}
        />
        <Route
          element={
            <AccessTab
              projectData={tabData[ProjectSettingsTabRoutes.Access].projectData}
              projectType={projectType}
              repoData={tabData[ProjectSettingsTabRoutes.Access].repoData}
            />
          }
          path={ProjectSettingsTabRoutes.Access}
        />
        <Route
          element={
            <VariablesTab
              // @ts-expect-error: FIXME. This comment was added by an automated script.
              identifier={identifier || repoId}
              projectData={
                tabData[ProjectSettingsTabRoutes.Variables].projectData
              }
              projectType={projectType}
              repoData={tabData[ProjectSettingsTabRoutes.Variables].repoData}
            />
          }
          path={ProjectSettingsTabRoutes.Variables}
        />
        <Route
          element={
            <GithubCommitQueueTab
              // @ts-expect-error: FIXME. This comment was added by an automated script.
              githubWebhooksEnabled={
                projectData?.githubWebhooksEnabled ||
                repoData?.githubWebhooksEnabled
              }
              // @ts-expect-error: FIXME. This comment was added by an automated script.
              identifier={identifier || repoId}
              projectData={
                tabData[ProjectSettingsTabRoutes.GithubCommitQueue].projectData
              }
              // @ts-expect-error: FIXME. This comment was added by an automated script.
              projectId={projectId}
              projectType={projectType}
              repoData={
                tabData[ProjectSettingsTabRoutes.GithubCommitQueue].repoData
              }
              // @ts-expect-error: FIXME. This comment was added by an automated script.
              versionControlEnabled={
                projectData?.projectRef?.versionControlEnabled ??
                repoData?.projectRef?.versionControlEnabled
              }
            />
          }
          path={ProjectSettingsTabRoutes.GithubCommitQueue}
        />
        <Route
          element={
            <PluginsTab
              projectData={
                tabData[ProjectSettingsTabRoutes.Plugins].projectData
              }
              projectType={projectType}
              repoData={tabData[ProjectSettingsTabRoutes.Plugins].repoData}
            />
          }
          path={ProjectSettingsTabRoutes.Plugins}
        />
        <Route
          element={
            <NotificationsTab
              id={projectId || repoData?.projectRef?.id}
              projectData={
                tabData[ProjectSettingsTabRoutes.Notifications].projectData
              }
              projectType={projectType}
              repoData={
                tabData[ProjectSettingsTabRoutes.Notifications].repoData
              }
            />
          }
          path={ProjectSettingsTabRoutes.Notifications}
        />
        <Route
          element={
            <PatchAliasesTab
              projectData={
                tabData[ProjectSettingsTabRoutes.PatchAliases].projectData
              }
              projectType={projectType}
              repoData={tabData[ProjectSettingsTabRoutes.PatchAliases].repoData}
            />
          }
          path={ProjectSettingsTabRoutes.PatchAliases}
        />
        <Route
          element={
            <VirtualWorkstationTab
              // @ts-expect-error: FIXME. This comment was added by an automated script.
              identifier={identifier || repoId}
              projectData={
                tabData[ProjectSettingsTabRoutes.VirtualWorkstation].projectData
              }
              projectType={projectType}
              repoData={
                tabData[ProjectSettingsTabRoutes.VirtualWorkstation].repoData
              }
            />
          }
          path={ProjectSettingsTabRoutes.VirtualWorkstation}
        />
        <Route
          element={
            <ContainersTab
              // @ts-expect-error: FIXME. This comment was added by an automated script.
              identifier={identifier || repoId}
              projectData={
                tabData[ProjectSettingsTabRoutes.Containers].projectData
              }
              projectType={projectType}
              repoData={tabData[ProjectSettingsTabRoutes.Containers].repoData}
            />
          }
          path={ProjectSettingsTabRoutes.Containers}
        />
        <Route
          element={
            <ViewsAndFiltersTab
              // @ts-expect-error: FIXME. This comment was added by an automated script.
              identifier={identifier}
              projectData={
                tabData[ProjectSettingsTabRoutes.ViewsAndFilters].projectData
              }
              projectType={projectType}
              repoData={
                tabData[ProjectSettingsTabRoutes.ViewsAndFilters].repoData
              }
            />
          }
          path={ProjectSettingsTabRoutes.ViewsAndFilters}
        />
        <Route
          element={
            <ProjectTriggersTab
              projectData={
                tabData[ProjectSettingsTabRoutes.ProjectTriggers].projectData
              }
              projectType={projectType}
              repoData={
                tabData[ProjectSettingsTabRoutes.ProjectTriggers].repoData
              }
            />
          }
          path={ProjectSettingsTabRoutes.ProjectTriggers}
        />
        <Route
          element={
            <PeriodicBuildsTab
              projectData={
                tabData[ProjectSettingsTabRoutes.PeriodicBuilds].projectData
              }
              projectType={projectType}
              repoData={
                tabData[ProjectSettingsTabRoutes.PeriodicBuilds].repoData
              }
            />
          }
          path={ProjectSettingsTabRoutes.PeriodicBuilds}
        />
        <Route
          element={
            <AppSettingsTab
              githubPermissionGroups={
                [
                ...(projectData?.projectRef
                  ?.githubDynamicTokenPermissionGroups ?? []),
                ...(repoData?.projectRef?.githubDynamicTokenPermissionGroups ??
                  []),
              ]
              }
              // @ts-expect-error: FIXME. This comment was added by an automated script.
              identifier={identifier}
              projectData={
                tabData[ProjectSettingsTabRoutes.GithubAppSettings].projectData
              }
              // @ts-expect-error: FIXME. This comment was added by an automated script.
              projectId={projectId}
              projectType={projectType}
              repoData={
                tabData[ProjectSettingsTabRoutes.GithubAppSettings].repoData
              }
              // @ts-expect-error: FIXME. This comment was added by an automated script.
              repoId={repoId}
            />
          }
          path={ProjectSettingsTabRoutes.GithubAppSettings}
        />
        <Route
          element={
            <PermissionGroupsTab
              // @ts-expect-error: FIXME. This comment was added by an automated script.
              identifier={identifier}
              projectData={
                tabData[ProjectSettingsTabRoutes.GithubPermissionGroups]
                  .projectData
              }
              projectType={projectType}
              repoData={
                tabData[ProjectSettingsTabRoutes.GithubPermissionGroups]
                  .repoData
              }
              // @ts-expect-error: FIXME. This comment was added by an automated script.
              repoId={repoId}
            />
          }
          path={ProjectSettingsTabRoutes.GithubPermissionGroups}
        />
        <Route
          element={
            <EventLogTab
              key={identifier}
              limit={45}
              projectType={projectType}
            />
          }
          path={ProjectSettingsTabRoutes.EventLog}
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
  projectData: ProjectSettings,
  projectType: ProjectType,
  repoData?: RepoSettings,
): TabDataProps =>
  Object.keys(gqlToFormMap).reduce(
    (obj, tab) => ({
      ...obj,
      [tab]: {
        // @ts-expect-error: FIXME. This comment was added by an automated script.
        projectData: gqlToFormMap[tab](projectData, { projectType }),
        // @ts-expect-error: FIXME. This comment was added by an automated script.
        repoData: gqlToFormMap[tab](repoData, { projectType }),
      },
    }),
    {} as TabDataProps,
  );

const Container = styled.div`
  min-width: 600px;
  width: 60%;
`;
