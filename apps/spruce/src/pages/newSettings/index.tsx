import React, { useRef, useState } from "react";
import { useQuery } from "@apollo/client";
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { FormSkeleton } from "@leafygreen-ui/skeleton-loader";
import { useParams, Navigate } from "react-router-dom";
import { size } from "@evg-ui/lib/constants/tokens";
import { useToastContext } from "@evg-ui/lib/context/toast";
import { usePageTitle } from "@evg-ui/lib/hooks/usePageTitle";
import {
  SideNav,
  SideNavGroup,
  SideNavItem,
  SideNavPageContent,
  SideNavPageWrapper,
} from "../../components/styles";
import {
  ProjectSettingsTabRoutes,
  getNewSettingsRoute,
} from "../../constants/routes";
import {
  ProjectSettingsQuery,
  ProjectSettingsQueryVariables,
} from "../../gql/generated/types";
import { PROJECT_SETTINGS } from "../../gql/queries";
import { useIsScrollAtTop } from "../../hooks";
import { ProjectType } from "../projectSettings/tabs/utils";
import { NewSettingsProvider } from "./Context";
import { getTabTitle } from "./getTabTitle";
import { NewSettingsTabs } from "./Tabs";

const NewSettings: React.FC = () => {
  usePageTitle(`New Settings`);
  const dispatchToast = useToastContext();
  const { tab } = useParams<{ tab?: ProjectSettingsTabRoutes }>();

  const pageWrapperRef = useRef<HTMLDivElement>(null);
  const { atTop } = useIsScrollAtTop(pageWrapperRef, 40);

  const [projectType] = useState<ProjectType>(ProjectType.Project);

  const projectIdentifier = "";

  const { data: projectData } = useQuery<
    ProjectSettingsQuery,
    ProjectSettingsQueryVariables
  >(PROJECT_SETTINGS, {
    variables: { projectIdentifier },
    onError: (e) => {
      dispatchToast.error(
        `There was an error loading the project ${projectIdentifier}: ${e.message}`,
      );
    },
  });

  const repoData = undefined;

  if (tab && !Object.values(ProjectSettingsTabRoutes).includes(tab)) {
    return (
      <Navigate
        replace
        to={getNewSettingsRoute(ProjectSettingsTabRoutes.General)}
      />
    );
  }

  const project = projectData?.projectSettings;

  const hasLoaded = projectData && project;

  return (
    <NewSettingsProvider>
      <SideNavPageWrapper>
        <SideNav aria-label="New Settings" widthOverride={250}>
          <ButtonsContainer>
            <Title>New Settings</Title>
          </ButtonsContainer>

          <SideNavGroup>
            {Object.values(ProjectSettingsTabRoutes).map((tabRoute) => (
              <NewSettingsNavItem
                key={tabRoute}
                currentTab={tab ?? ProjectSettingsTabRoutes.General}
                tab={tabRoute}
              />
            ))}
          </SideNavGroup>
        </SideNav>
        <SideNavPageContent
          ref={pageWrapperRef}
          css={css`
            padding-top: 0;
            margin-top: ${size.m};
          `}
          data-cy="new-settings-page"
        >
          {hasLoaded ? (
            <NewSettingsTabs
              atTop={atTop}
              projectData={projectData?.projectSettings}
              projectType={projectType}
              repoData={repoData}
            />
          ) : (
            <FormSkeleton />
          )}
        </SideNavPageContent>
      </SideNavPageWrapper>
    </NewSettingsProvider>
  );
};

const NewSettingsNavItem: React.FC<{
  currentTab: ProjectSettingsTabRoutes;
  tab: ProjectSettingsTabRoutes;
  title?: string;
}> = ({ currentTab, tab, title }) => (
  <SideNavItem
    active={tab === currentTab}
    as="a"
    data-cy={`navitem-${tab}`}
    href={getNewSettingsRoute(tab)}
  >
    {title || getTabTitle(tab).title}
  </SideNavItem>
);

const ButtonsContainer = styled.div`
  align-items: flex-start;
  display: flex;
  flex-direction: column;
  gap: ${size.xs};
  margin: 0 ${size.s};
`;

const Title = styled.h2`
  margin: ${size.xs} 0;
`;

export default NewSettings;
