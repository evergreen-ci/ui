import styled from "@emotion/styled";
import { Link } from "react-router-dom";
import { size, palette } from "@evg-ui/lib/constants/tokens-via";
import {
  getAgentDetailRoute,
  getAgentRunsRoute,
  routes,
} from "constants/routes";

export const NavBar: React.FC = () => (
  <NavContainer>
    <PrimaryLink to={routes.home}>Home</PrimaryLink>
    <PrimaryLink to={getAgentDetailRoute("sage-bot")}>Agent Info</PrimaryLink>
    <PrimaryLink to={getAgentRunsRoute("sage-bot", "abcdefg")}>
      Agent Runs
    </PrimaryLink>
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

const PrimaryLink = styled(Link)`
  color: ${palette.gray.dark3};
  text-decoration: none;
`;
