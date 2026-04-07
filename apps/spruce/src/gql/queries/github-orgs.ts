import { gql } from "@apollo/client";

const GITHUB_ORGS = gql`
  query GithubOrgs {
    spruceConfig {
      githubOrgs
    }
  }
`;

export default GITHUB_ORGS;
