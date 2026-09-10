import { Banner } from "@via-ds/components/banner";
import { Link } from "@via-ds/components/typography";
import { useNavigate } from "react-router-dom";
import { PreferencesTabRoutes, getPreferencesRoute } from "constants/routes";
import { useUserSettings } from "hooks";

export const GithubUsernameBanner = () => {
  const navigate = useNavigate();
  const { userSettings } = useUserSettings();
  const { githubUser } = userSettings || {};
  const { lastKnownAs } = githubUser || {};
  const hasNoGithubUser = lastKnownAs === "";

  return hasNoGithubUser ? (
    <Banner data-testid="github-username-banner" variant="warning">
      Please set your GitHub username on the{" "}
      <Link
        href={getPreferencesRoute(PreferencesTabRoutes.Profile)}
        isStandalone={false}
        linkStyle="internal"
        onPress={() => {
          navigate(getPreferencesRoute(PreferencesTabRoutes.Profile));
        }}
      >
        settings page
      </Link>
      . Evergreen uses this to map GitHub pull requests to your Evergreen user
      account.
    </Banner>
  ) : null;
};
