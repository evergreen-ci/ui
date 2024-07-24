import { isProduction } from "utils/environmentVariables";

export const showGitHubAccessTokenProject = !isProduction();
export const showImageVisibilityPage = !isProduction();
