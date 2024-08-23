import { useQuery } from "@apollo/client";
import styled from "@emotion/styled";
import { sideNavItemSidePadding } from "@leafygreen-ui/side-nav";
import { useParams, Link, Navigate } from "react-router-dom";
import Icon from "components/Icon";
import {
  SideNav,
  SideNavGroup,
  SideNavItem,
  PageWrapper,
} from "components/styles";
import { SideNavItemLink } from "components/styles/SideNav";
import { showImageVisibilityPage } from "constants/featureFlags";
import {
  DistroSettingsTabRoutes,
  getDistroSettingsRoute,
  getImageRoute,
  getTaskQueueRoute,
  ImageTabRoutes,
  slugs,
} from "constants/routes";
import { size } from "constants/tokens";
import { useToastContext } from "context/toast";
import { DistroQuery, DistroQueryVariables } from "gql/generated/types";
import { DISTRO } from "gql/queries";
import { usePageTitle } from "hooks";
import { DistroSettingsProvider } from "./Context";
import { DistroSelect } from "./DistroSelect";
import { getTabTitle } from "./getTabTitle";
import { NewDistroButton } from "./NewDistro/NewDistroButton";
import { DistroSettingsTabs } from "./Tabs";

const DistroSettings: React.FC = () => {
  usePageTitle("Distro Settings");
  const dispatchToast = useToastContext();
  const { [slugs.distroId]: distroId, [slugs.tab]: currentTab } = useParams<{
    [slugs.distroId]: string;
    [slugs.tab]: DistroSettingsTabRoutes;
  }>();

  const { data, loading } = useQuery<DistroQuery, DistroQueryVariables>(
    DISTRO,
    {
      // @ts-expect-error: FIXME. This comment was added by an automated script.
      variables: { distroId },
      onError: (e) => {
        dispatchToast.error(
          `There was an error loading the distro ${distroId}: ${e.message}`,
        );
      },
    },
  );

  // @ts-expect-error: FIXME. This comment was added by an automated script.
  if (!Object.values(DistroSettingsTabRoutes).includes(currentTab)) {
    return (
      <Navigate
        replace
        // @ts-expect-error: FIXME. This comment was added by an automated script.
        to={getDistroSettingsRoute(distroId, DistroSettingsTabRoutes.General)}
      />
    );
  }

  return (
    <DistroSettingsProvider>
      <SideNav aria-label="Distro Settings" widthOverride={250}>
        <ButtonsContainer>
          {/* @ts-expect-error: FIXME. This comment was added by an automated script. */}
          <DistroSelect selectedDistro={distroId} />
          <NewDistroButton />
        </ButtonsContainer>
        <SideNavGroup>
          {Object.values(DistroSettingsTabRoutes).map((tab) => (
            <SideNavItem
              active={tab === currentTab}
              as={Link}
              key={tab}
              // @ts-expect-error: FIXME. This comment was added by an automated script.
              to={getDistroSettingsRoute(distroId, tab)}
              data-cy={`navitem-${tab}`}
            >
              {getTabTitle(tab).title}
            </SideNavItem>
          ))}
        </SideNavGroup>
        <SideNavGroup glyph={<Icon glyph="Link" />} header="Links">
          <SideNavItemLink
            // @ts-expect-error: FIXME. This comment was added by an automated script.
            to={getTaskQueueRoute(distroId)}
            data-cy="navitem-task-queue-link"
          >
            Task Queue
          </SideNavItemLink>
          {showImageVisibilityPage && (
            <SideNavItemLink
              to={getImageRoute(
                data?.distro?.imageId ?? "",
                ImageTabRoutes.BuildInformation,
              )}
              data-cy="navitem-image-build-information-link"
            >
              Image Build Information
            </SideNavItemLink>
          )}
          {showImageVisibilityPage && (
            <SideNavItemLink
              to={getImageRoute(
                data?.distro?.imageId ?? "",
                ImageTabRoutes.EventLog,
              )}
              data-cy="navitem-image-event-log-link"
            >
              Image Event Log
            </SideNavItemLink>
          )}
        </SideNavGroup>
      </SideNav>
      <PageWrapper data-cy="distro-settings-page">
        {!loading && data?.distro && (
          <DistroSettingsTabs distro={data.distro} />
        )}
      </PageWrapper>
    </DistroSettingsProvider>
  );
};

const ButtonsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${size.xs};
  margin: 0 ${sideNavItemSidePadding}px;
`;

export default DistroSettings;
