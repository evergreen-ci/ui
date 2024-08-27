import { isProduction } from "utils/environmentVariables";

export const showImageVisibilityPage = !isProduction();
