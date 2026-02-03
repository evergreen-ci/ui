import { useEffect } from "react";
import { useQuery } from "@apollo/client/react";
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { palette } from "@leafygreen-ui/palette";
import Cookies from "js-cookie";
import { Link, useParams } from "react-router-dom";
import { AnimatedIcon, Icon, WinterLogo } from "@evg-ui/lib/components";
import { size } from "@evg-ui/lib/constants";
import { useAuthProviderContext } from "@evg-ui/lib/context";
import { useNavbarAnalytics } from "analytics";
import { navBarHeight } from "components/styles/Layout";
import { CURRENT_PROJECT } from "constants/cookies";
import { wikiUrl } from "constants/externalResources";
import {
  getUserPatchesRoute,
  getWaterfallRoute,
  routes,
  slugs,
} from "constants/routes";
import { UserQuery, SpruceConfigQuery } from "gql/generated/types";
import { USER, SPRUCE_CONFIG } from "gql/queries";
import { validators } from "utils";
import { AuxiliaryDropdown } from "./AuxiliaryDropdown";
import { UserDropdown } from "./UserDropdown";

const { validateObjectId } = validators;

const { blue, gray, white } = palette;

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

  const { data: configData } = useQuery<SpruceConfigQuery>(SPRUCE_CONFIG, {
    skip: currProject !== undefined,
  });

  const projectIdentifier =
    currProject || configData?.spruceConfig?.ui?.defaultProject;

  if (!isAuthenticated) {
    return null;
  }
  return (
    <StyledNav>
      <NavActionContainer>
        <LogoLink
          onClick={() => sendEvent({ name: "Clicked logo link" })}
          to={routes.myPatches}
        >
          <AnimatedIcon alwaysAnimate icon={WinterLogo} />
        </LogoLink>
        <PrimaryLink
          data-cy="waterfall-link"
          onClick={() => sendEvent({ name: "Clicked waterfall link" })}
          to={getWaterfallRoute(projectIdentifier)}
        >
          Waterfall
        </PrimaryLink>
        <PrimaryLink
          onClick={() => sendEvent({ name: "Clicked my patches link" })}
          // @ts-expect-error: FIXME. This comment was added by an automated script.
          to={getUserPatchesRoute(userId)}
        >
          My Patches
        </PrimaryLink>
        <PrimaryLink
          onClick={() => sendEvent({ name: "Clicked my hosts link" })}
          to={routes.spawnHost}
        >
          My Hosts
        </PrimaryLink>
        {/* @ts-expect-error: FIXME. This comment was added by an automated script. */}
        <AuxiliaryDropdown projectIdentifier={projectIdentifier} />
      </NavActionContainer>
      <NavActionContainer>
        <PrimaryAWithIcon
          href={wikiUrl}
          onClick={() => sendEvent({ name: "Clicked EVG wiki link" })}
          target="_blank"
        >
          <Icon glyph="QuestionMarkWithCircle" />
          Documentation
        </PrimaryAWithIcon>
        <UserDropdown />
      </NavActionContainer>
    </StyledNav>
  );
};

const StyledNav = styled.nav`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${size.xxl};
  background-color: ${gray.dark3};
  height: ${navBarHeight};
  line-height: ${navBarHeight};
  padding: 0 ${size.l};
`;

const LogoLink = styled(Link)`
  display: flex;
  align-items: center;
  margin-bottom: ${size.xxs};
`;

const NavActionContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: ${size.l};
`;

const primaryLinkStyle = css`
  color: ${white};
  transition: all 100ms ease-in;
  flex-shrink: 0;

  :hover {
    color: ${blue.light1};
  }
`;

const PrimaryLink = styled(Link)`
  ${primaryLinkStyle}
`;

const PrimaryA = styled.a`
  ${primaryLinkStyle}
`;

const PrimaryAWithIcon = styled(PrimaryA)`
  display: flex;
  align-items: center;
  > svg {
    margin-right: ${size.xxs};
  }
`;
