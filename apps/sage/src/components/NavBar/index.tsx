import styled from "@emotion/styled";
import { createLink } from "@tanstack/react-router";
import { size, palette } from "@evg-ui/lib/constants/tokens-via";

export const NavBar: React.FC = () => (
  <NavContainer>
    <NavLink to="/">Home</NavLink>
    <NavLink params={{ agentId: "sage-bot" }} to="/agents/$agentId">
      Agent Info
    </NavLink>
    <NavLink
      params={{ agentId: "sage-bot", runId: "abcdefg" }}
      to="/agents/$agentId/runs/$runId"
    >
      Agent Runs
    </NavLink>
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

const Link = styled.a`
  color: ${palette.gray.dark3};
  text-decoration: none;
`;

const NavLink = createLink(Link);
