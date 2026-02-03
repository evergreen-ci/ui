import { Icon } from "@leafygreen-ui/icon";
import { useParams, Link } from "react-router-dom";
import { usePageTitle } from "@evg-ui/lib/hooks";
import { usePreferencesAnalytics } from "analytics";
import {
  SideNav,
  SideNavGroup,
  SideNavItem,
  SideNavPageContent,
  SideNavPageWrapper,
} from "components/styles";
import {
  PreferencesTabRoutes,
  getPreferencesRoute,
  slugs,
} from "constants/routes";
import { PreferencesTabs } from "pages/preferences/PreferencesTabs";

const Preferences: React.FC = () => {
  usePageTitle("Preferences");
  const { [slugs.tab]: tab } = useParams<{
    [slugs.tab]: PreferencesTabRoutes;
  }>();
  const { sendEvent } = usePreferencesAnalytics();

  return (
    <SideNavPageWrapper>
      <SideNav aria-label="Preferences">
        <SideNavGroup glyph={<Icon glyph="Settings" />} header="Preferences">
          <SideNavItem
            active={tab === PreferencesTabRoutes.Profile}
            as={Link}
            data-cy="profile-nav-tab"
            onClick={() =>
              sendEvent({
                name: "Changed tab",
                tab: PreferencesTabRoutes.Profile,
              })
            }
            to={getPreferencesRoute(PreferencesTabRoutes.Profile)}
          >
            Profile
          </SideNavItem>
          <SideNavItem
            active={tab === PreferencesTabRoutes.Notifications}
            as={Link}
            data-cy="notifications-nav-tab"
            onClick={() =>
              sendEvent({
                name: "Changed tab",
                tab: PreferencesTabRoutes.Notifications,
              })
            }
            to={getPreferencesRoute(PreferencesTabRoutes.Notifications)}
          >
            Notifications
          </SideNavItem>
          <SideNavItem
            active={tab === PreferencesTabRoutes.CLI}
            as={Link}
            data-cy="cli-nav-tab"
            onClick={() =>
              sendEvent({
                name: "Changed tab",
                tab: PreferencesTabRoutes.CLI,
              })
            }
            to={getPreferencesRoute(PreferencesTabRoutes.CLI)}
          >
            CLI & API
          </SideNavItem>
          <SideNavItem
            active={tab === PreferencesTabRoutes.PublicKeys}
            as={Link}
            data-cy="publickeys-nav-tab"
            onClick={() =>
              sendEvent({
                name: "Changed tab",
                tab: PreferencesTabRoutes.PublicKeys,
              })
            }
            to={getPreferencesRoute(PreferencesTabRoutes.PublicKeys)}
          >
            Public Keys
          </SideNavItem>
          <SideNavItem
            active={tab === PreferencesTabRoutes.UISettings}
            as={Link}
            data-cy="ui-settings-nav-tab"
            onClick={() =>
              sendEvent({
                name: "Changed tab",
                tab: PreferencesTabRoutes.UISettings,
              })
            }
            to={getPreferencesRoute(PreferencesTabRoutes.UISettings)}
          >
            UI Settings
          </SideNavItem>
          <SideNavItem
            active={tab === PreferencesTabRoutes.SageBotSettings}
            as={Link}
            data-cy="sage-bot-settings-nav-tab"
            onClick={() =>
              sendEvent({
                name: "Changed tab",
                tab: PreferencesTabRoutes.SageBotSettings,
              })
            }
            to={getPreferencesRoute(PreferencesTabRoutes.SageBotSettings)}
          >
            Sage Bot Settings
          </SideNavItem>
        </SideNavGroup>
      </SideNav>
      <SideNavPageContent>
        <PreferencesTabs />
      </SideNavPageContent>
    </SideNavPageWrapper>
  );
};

export default Preferences;
