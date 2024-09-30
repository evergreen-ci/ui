import { useQuery } from "@apollo/client";
import styled from "@emotion/styled";
import { sideNavItemSidePadding } from "@leafygreen-ui/side-nav";
import { useParams, Link, Navigate } from "react-router-dom";
import Icon from "components/Icon";
import {
  SideNav,
  SideNavGroup,
  SideNavItem,
  SideNavPageContent,
  SideNavPageWrapper,
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
      <SideNavPageWrapper>
        <SideNav aria-label="Distro Settings" widthOverride={250}>
          <ButtonsContainer>
            {/* @ts-expect-error: FIXME. This comment was added by an automated script. */}
            <DistroSelect selectedDistro={distroId} />
            <NewDistroButton />
          </ButtonsContainer>
          <SideNavGroup>
            {Object.values(DistroSettingsTabRoutes).map((tab) => (
              <SideNavItem
                key={tab}
                active={tab === currentTab}
                as={Link}
                data-cy={`navitem-${tab}`}
                // @ts-expect-error: FIXME. This comment was added by an automated script.
                to={getDistroSettingsRoute(distroId, tab)}
              >
                {getTabTitle(tab).title}
              </SideNavItem>
            ))}
          </SideNavGroup>
          <SideNavGroup glyph={<Icon glyph="Link" />} header="Links">
            <SideNavItemLink
              data-cy="navitem-task-queue-link"
              // @ts-expect-error: FIXME. This comment was added by an automated script.
              to={getTaskQueueRoute(distroId)}
            >
              Task Queue
            </SideNavItemLink>
            {showImageVisibilityPage && (
              <SideNavItemLink
                data-cy="navitem-image-build-information-link"
                to={getImageRoute(
                  data?.distro?.imageId ?? "",
                  ImageTabRoutes.BuildInformation,
                )}
              >
                Image Build Information
              </SideNavItemLink>
            )}
            {showImageVisibilityPage && (
              <SideNavItemLink
                data-cy="navitem-image-event-log-link"
                to={getImageRoute(
                  data?.distro?.imageId ?? "",
                  ImageTabRoutes.EventLog,
                )}
              >
                Image Event Log
              </SideNavItemLink>
            )}
          </SideNavGroup>
        </SideNav>
        <SideNavPageContent data-cy="distro-settings-page">
          {!loading && data?.distro && (
            <DistroSettingsTabs distro={data.distro} />
          )}
        </SideNavPageContent>
      </SideNavPageWrapper>
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
