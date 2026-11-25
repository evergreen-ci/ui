import { Banner, Text } from "@via-ds/components";
import { StyledRouterLink } from "@evg-ui/lib/components/styles";
import { PreferencesTabRoutes, getPreferencesRoute } from "constants/routes";
import { useUserSettings } from "hooks";
import styles from "./styles.module.css";

export const GithubUsernameBanner = () => {
  const { userSettings } = useUserSettings();
  const { githubUser } = userSettings || {};
  const { lastKnownAs } = githubUser || {};
  const hasNoGithubUser = lastKnownAs === "";

  return hasNoGithubUser ? (
    <Banner
      className={styles.legacyLinks}
      data-testid="github-username-banner"
      variant="warning"
    >
      <Text>
        Please set your GitHub username on the{" "}
        <StyledRouterLink
          to={getPreferencesRoute(PreferencesTabRoutes.Profile)}
        >
          settings page
        </StyledRouterLink>
        . Evergreen uses this to map GitHub pull requests to your Evergreen user
        account.
      </Text>
    </Banner>
  ) : null;
};
