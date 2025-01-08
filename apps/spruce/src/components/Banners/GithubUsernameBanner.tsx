import { useQuery } from "@apollo/client";
import Banner from "@leafygreen-ui/banner";
import { StyledRouterLink } from "@evg-ui/lib/components/styles";
import { getPreferencesRoute, PreferencesTabRoutes } from "constants/routes";
import { UserSettingsQuery } from "gql/generated/types";
import { USER_SETTINGS } from "gql/queries";

export const GithubUsernameBanner = () => {
  // USER SETTINGS QUERY
  const { data: userSettingsData } = useQuery<UserSettingsQuery>(USER_SETTINGS);
  const { userSettings } = userSettingsData || {};
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
