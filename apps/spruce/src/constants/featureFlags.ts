import { isProduction } from "utils/environmentVariables";

export const showGitHubAccessTokenProject = !isProduction();
