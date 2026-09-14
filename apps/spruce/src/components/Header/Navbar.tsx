import { useEffect } from "react";
import { skipToken, useQuery } from "@apollo/client/react";
import Cookies from "js-cookie";
import { Link, useParams } from "react-router-dom";
import Icon, { EvergreenLogo } from "@evg-ui/lib/components/Icon";
import { useAuthProviderContext } from "@evg-ui/lib/context/AuthProvider";
import { cx } from "@evg-ui/lib/utils/css";
import { useNavbarAnalytics } from "analytics";
import { CURRENT_PROJECT } from "constants/cookies";
import { wikiUrl } from "constants/externalResources";
import {
  getUserPatchesRoute,
  getWaterfallRoute,
  routes,
  slugs,
} from "constants/routes";
import { SpruceConfigQuery, UserQuery } from "gql/generated/types";
import { SPRUCE_CONFIG, USER } from "gql/queries";
import { validators } from "utils";
import { AuxiliaryDropdown } from "./AuxiliaryDropdown";
import styles from "./Navbar.module.css";
import { UserDropdown } from "./UserDropdown";

const { validateObjectId } = validators;

export const Navbar: React.FC = () => {
  const { isAuthenticated } = useAuthProviderContext();
  const { sendEvent } = useNavbarAnalytics();

  const { data: userData } = useQuery<UserQuery>(USER);
  const { user } = userData || {};
  const { userId } = user || {};

  const { [slugs.projectIdentifier]: projectFromUrl } = useParams();
  const currProject = Cookies.get(CURRENT_PROJECT);

  // Update current project cookie if the project in the URL is not an objectId and is not equal
  // to the current project.
  // This will inform future navigations to the /waterfall page.
  useEffect(() => {
    if (
      projectFromUrl &&
      !validateObjectId(projectFromUrl) &&
      projectFromUrl !== currProject
    ) {
      Cookies.set(CURRENT_PROJECT, projectFromUrl);
    }
  }, [currProject, projectFromUrl]);

  const { data: configData } = useQuery<SpruceConfigQuery>(
    SPRUCE_CONFIG,
    currProject === undefined ? {} : skipToken,
  );

  const projectIdentifier =
    currProject || configData?.spruceConfig?.ui?.defaultProject;

  if (!isAuthenticated) {
    return null;
  }
  return (
    <nav className={styles.navbar}>
      <div className={styles.navActionContainer}>
        <Link
          className={styles.logoLink}
          onClick={() => sendEvent({ name: "Clicked logo link" })}
          to={routes.myPatches}
        >
          <EvergreenLogo size={36} />
        </Link>
        <Link
          className={styles.primaryLink}
          data-testid="waterfall-link"
          onClick={() => sendEvent({ name: "Clicked waterfall link" })}
          to={getWaterfallRoute(projectIdentifier)}
        >
          Waterfall
        </Link>
        <Link
          className={styles.primaryLink}
          onClick={() => sendEvent({ name: "Clicked my patches link" })}
          // @ts-expect-error: FIXME. This comment was added by an automated script.
          to={getUserPatchesRoute(userId)}
        >
          My Patches
        </Link>
        <Link
          className={styles.primaryLink}
          onClick={() => sendEvent({ name: "Clicked my hosts link" })}
          to={routes.spawnHost}
        >
          My Hosts
        </Link>
        {/* @ts-expect-error: FIXME. This comment was added by an automated script. */}
        <AuxiliaryDropdown projectIdentifier={projectIdentifier} />
      </div>
      <div className={styles.navActionContainer}>
        <a
          className={cx(styles.primaryLink, styles.primaryAWithIcon)}
          href={wikiUrl}
          onClick={() => sendEvent({ name: "Clicked EVG wiki link" })}
          rel="noreferrer"
          target="_blank"
        >
          <Icon glyph="QuestionMarkWithCircle" />
          Documentation
        </a>
        <UserDropdown />
      </div>
    </nav>
  );
};
