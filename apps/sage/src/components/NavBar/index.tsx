import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { Link } from "@tanstack/react-router";
import { size, palette } from "@evg-ui/lib/constants/tokens-via";
import { routes } from "constants/routes";

export const NavBar: React.FC = () => (
  <NavContainer>
    <Link css={linkStyles} to="/">
      Home
    </Link>
    <Link
      css={linkStyles}
      params={{ agentId: "sage-bot" }}
      to={routes.agentDetail}
    >
      Agent Info
    </Link>
    <Link
      css={linkStyles}
      params={{ agentId: "sage-bot", runId: "abcdefg" }}
      to="/agents/$agentId/runs/$runId"
    >
      Agent Runs
    </Link>
  </NavContainer>
);

const NavContainer = styled.nav`
  display: flex;
  align-items: center;
  gap: ${size.m};
  flex-shrink: 0;

  background-color: ${palette.gray.light3};
  padding: ${size.s};
`;

const linkStyles = css`
  color: ${palette.gray.dark3};
  text-decoration: none;
`;
