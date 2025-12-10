import { useQuery } from "@apollo/client";
import styled from "@emotion/styled";
import { sideNavItemSidePadding } from "@leafygreen-ui/side-nav";
import { useParams, Link, Navigate } from "react-router-dom";
import { usePageVisibilityAnalytics } from "@evg-ui/lib/analytics/hooks/usePageVisibilityAnalytics";
import Icon from "@evg-ui/lib/components/Icon";
import { size } from "@evg-ui/lib/constants/tokens";
import { useToastContext } from "@evg-ui/lib/context/toast";
import { usePageTitle } from "@evg-ui/lib/hooks/usePageTitle";
import { useDistroSettingsAnalytics } from "analytics";
import {
  SettingsPageContent,
  SideNav,
  SideNavGroup,
  SideNavItem,
  SideNavPageWrapper,
} from "components/styles";
import { SideNavItemLink } from "components/styles/SideNav";
import {
  DistroSettingsTabRoutes,
  getDistroSettingsRoute,
  getImageRoute,
  getTaskQueueRoute,
  ImageTabRoutes,
  slugs,
} from "constants/routes";
import { DistroQuery, DistroQueryVariables } from "gql/generated/types";
import { DISTRO } from "gql/queries";
import { DistroSettingsProvider } from "./Context";
import { DistroSelect } from "./DistroSelect";
import { getTabTitle } from "./getTabTitle";
import { NewDistroButton } from "./NewDistro/NewDistroButton";
import { DistroSettingsTabs } from "./Tabs";

const DistroSettings: React.FC = () => {
  usePageVisibilityAnalytics({ identifier: "DistroSettings" });
  usePageTitle("Distro Settings");
  const { sendEvent } = useDistroSettingsAnalytics();
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

  const imageId = data?.distro?.imageId ?? "";

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
            {Object.values(DistroSettingsTabRoutes)
              .filter((v) => v !== DistroSettingsTabRoutes.SingleTaskDistros)
              .map((tab) => (
                <SideNavItem
                  key={tab}
                  active={tab === currentTab}
                  as={Link}
                  data-cy={`navitem-${tab}`}
                  to={getDistroSettingsRoute(distroId ?? "", tab)}
                >
                  {getTabTitle(tab).title}
                </SideNavItem>
              ))}
          </SideNavGroup>
          <SideNavGroup glyph={<Icon glyph="Link" />} header="Resources">
            <SideNavItem
              key={DistroSettingsTabRoutes.SingleTaskDistros}
              active={DistroSettingsTabRoutes.SingleTaskDistros === currentTab}
              as={Link}
              data-cy={`navitem-${DistroSettingsTabRoutes.SingleTaskDistros}`}
              to={getDistroSettingsRoute(
                distroId ?? "",
                DistroSettingsTabRoutes.SingleTaskDistros,
              )}
            >
              {getTabTitle(DistroSettingsTabRoutes.SingleTaskDistros).title}
            </SideNavItem>
            <SideNavItemLink
              data-cy="navitem-task-queue-link"
              onClick={() =>
                sendEvent({ name: "Clicked link", link: "Task Queue" })
              }
              // @ts-expect-error: FIXME. This comment was added by an automated script.
              to={getTaskQueueRoute(distroId)}
            >
              Task Queue
            </SideNavItemLink>
            {imageId && (
              <SideNavItemLink
                data-cy="navitem-image-build-information-link"
                onClick={() =>
                  sendEvent({
                    name: "Clicked link",
                    link: "Image Build Information",
                  })
                }
                to={getImageRoute(imageId, ImageTabRoutes.BuildInformation)}
              >
                Image Build Information
              </SideNavItemLink>
            )}
            {imageId && (
              <SideNavItemLink
                data-cy="navitem-image-event-log-link"
                onClick={() =>
                  sendEvent({
                    name: "Clicked link",
                    link: "Image Event Log",
                  })
                }
                to={getImageRoute(imageId, ImageTabRoutes.EventLog)}
              >
                Image Event Log
              </SideNavItemLink>
            )}
          </SideNavGroup>
        </SideNav>
        <SettingsPageContent data-cy="distro-settings-page">
          {!loading && data?.distro && (
            <DistroSettingsTabs distro={data.distro} />
          )}
        </SettingsPageContent>
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
