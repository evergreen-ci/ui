import { useEffect, useMemo } from "react";
import styled from "@emotion/styled";
import { Navigate, Route, Routes, useParams } from "react-router-dom";
import { ProjectSettingsTabRoutes, slugs } from "constants/routes";
import { ProjectSettingsQuery, RepoSettingsQuery } from "gql/generated/types";
import useScrollToAnchor from "hooks/useScrollToAnchor";
import { useProjectSettingsContext } from "./Context";
import { Header } from "./Header";
import { NavigationModal } from "./NavigationModal";
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
  projectData?: ProjectSettings;
  projectType: ProjectType;
  repoData?: RepoSettings;
}

export const ProjectSettingsTabs: React.FC<Props> = ({
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
        attachedRepoId={projectData?.projectRef?.repoRefId}
        // @ts-expect-error: FIXME. This comment was added by an automated script.
        id={projectId || repoId}
        projectType={projectType}
        // @ts-expect-error: FIXME. This comment was added by an automated script.
        tab={tab}
      />
      <Routes>
        <Route
          path={ProjectSettingsTabRoutes.General}
          element={
            <GeneralTab
              projectId={projectId}
              projectData={
                tabData[ProjectSettingsTabRoutes.General].projectData
              }
              projectType={projectType}
              repoData={tabData[ProjectSettingsTabRoutes.General].repoData}
            />
          }
        />
        <Route
          path={ProjectSettingsTabRoutes.Access}
          element={
            <AccessTab
              projectData={tabData[ProjectSettingsTabRoutes.Access].projectData}
              projectType={projectType}
              repoData={tabData[ProjectSettingsTabRoutes.Access].repoData}
            />
          }
        />
        <Route
          path={ProjectSettingsTabRoutes.Variables}
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
        />
        <Route
          path={ProjectSettingsTabRoutes.GithubCommitQueue}
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
        />
        <Route
          path={ProjectSettingsTabRoutes.Plugins}
          element={
            <PluginsTab
              projectData={
                tabData[ProjectSettingsTabRoutes.Plugins].projectData
              }
              projectType={projectType}
              repoData={tabData[ProjectSettingsTabRoutes.Plugins].repoData}
            />
          }
        />
        <Route
          path={ProjectSettingsTabRoutes.Notifications}
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
        />
        <Route
          path={ProjectSettingsTabRoutes.PatchAliases}
          element={
            <PatchAliasesTab
              projectData={
                tabData[ProjectSettingsTabRoutes.PatchAliases].projectData
              }
              projectType={projectType}
              repoData={tabData[ProjectSettingsTabRoutes.PatchAliases].repoData}
            />
          }
        />
        <Route
          path={ProjectSettingsTabRoutes.VirtualWorkstation}
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
        />
        <Route
          path={ProjectSettingsTabRoutes.Containers}
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
        />
        <Route
          path={ProjectSettingsTabRoutes.ViewsAndFilters}
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
        />
        <Route
          path={ProjectSettingsTabRoutes.ProjectTriggers}
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
        />
        <Route
          path={ProjectSettingsTabRoutes.PeriodicBuilds}
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
        />
        <Route
          path={ProjectSettingsTabRoutes.EventLog}
          element={
            <EventLogTab
              projectType={projectType}
              key={identifier}
              limit={45}
            />
          }
        />
        <Route
          path="*"
          element={<Navigate to={ProjectSettingsTabRoutes.General} replace />}
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
