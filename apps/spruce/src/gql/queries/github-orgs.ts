import { gql } from "@apollo/client";

export const GITHUB_ORGS = gql`
  query GithubOrgs {
    spruceConfig {
      githubOrgs
    }
  }
`;
