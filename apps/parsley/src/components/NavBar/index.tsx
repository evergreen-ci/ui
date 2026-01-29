import { useState } from "react";
import styled from "@emotion/styled";
import { Button } from "@leafygreen-ui/button";
import { IconButton } from "@leafygreen-ui/icon-button";
import { palette } from "@leafygreen-ui/palette";
import Icon from "@evg-ui/lib/components/Icon";
import { StyledLink } from "@evg-ui/lib/components/styles";
import { size } from "@evg-ui/lib/constants/tokens";
import { useAuthProviderContext } from "@evg-ui/lib/context/AuthProvider";
import DetailsMenu from "components/DetailsMenu";
import Search from "components/Search";
import ShortcutModal from "components/ShortcutModal";
import { docsURL } from "constants/externalLinks";
import { navbarHeight } from "constants/tokens";
import { useLogContext } from "context/LogContext";
import { isDevelopmentBuild } from "utils/environmentVariables";
import UploadLink from "./UploadLink";

const { gray, white } = palette;

const NavBar: React.FC = () => {
  const [open, setOpen] = useState(false);
  const { clearLogs, hasLogs } = useLogContext();
  const { logoutAndRedirect } = useAuthProviderContext();

  return (
    <Container>
      <FlexContainer>
        {/* @ts-expect-error: useStroke is not recognized as a valid prop */}
        <Logo glyph="ParsleyLogo" size={24} useStroke />
        <LinkContainer>
          <StyledLink href={`${docsURL}/Home`}>Docs</StyledLink>
          <UploadLink clearLogs={clearLogs} hasLogs={hasLogs} />
        </LinkContainer>
        <Search />
      </FlexContainer>
      <FlexContainer>
        <IconButton
          aria-label="Open shortcut modal"
          onClick={() => setOpen(true)}
        >
          <Icon glyph="InfoWithCircle" />
        </IconButton>
        <StyledDetailsMenu data-cy="details-button" disabled={!hasLogs} />
        {isDevelopmentBuild() && (
          <Button
            onClick={logoutAndRedirect}
            size="small"
            variant="dangerOutline"
          >
            Log out
          </Button>
        )}
      </FlexContainer>
      <ShortcutModal open={open} setOpen={setOpen} />
    </Container>
  );
};

const Container = styled.nav`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;

  height: ${navbarHeight};
  background-color: ${white};
  border-bottom: 1px solid ${gray.light2};
  padding: 0 ${size.s};
`;

const Logo = styled(Icon)`
  margin-right: ${size.m};
`;

const FlexContainer = styled.div`
  display: flex;
  align-items: center;
`;

const LinkContainer = styled.div`
  display: flex;
  margin-right: ${size.l};
  gap: ${size.l};
`;

const StyledDetailsMenu = styled(DetailsMenu)`
  margin: 0 ${size.xs};
`;

export default NavBar;
