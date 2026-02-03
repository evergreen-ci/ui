import { Banner } from "@leafygreen-ui/banner";
import { StyledRouterLink } from "@evg-ui/lib/components";
import { getPreferencesRoute, PreferencesTabRoutes } from "constants/routes";
import { useUserSettings } from "hooks";

export const GithubUsernameBanner = () => {
  const { userSettings } = useUserSettings();
  const { githubUser } = userSettings || {};
  const { lastKnownAs } = githubUser || {};
  const hasNoGithubUser = lastKnownAs === "";

  return hasNoGithubUser ? (
    <Banner data-cy="github-username-banner" variant="warning">
      Please set your GitHub username on the{" "}
      <StyledRouterLink to={getPreferencesRoute(PreferencesTabRoutes.Profile)}>
        settings page
      </StyledRouterLink>
      . Evergreen uses this to map GitHub pull requests to your Evergreen user
      account.
    </Banner>
  ) : null;
};
