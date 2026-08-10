import { styled } from "@linaria/react";

const PageLayout = styled.div`
  // PageLayout should take up the remaining page height after the NavBar.
  flex: 1 1 auto;
  overflow-y: hidden;
`;

export { PageLayout };
