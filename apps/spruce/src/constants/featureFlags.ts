import { isProduction } from "utils/environmentVariables";

export const showImageVisibilityPage = !isProduction();
export const showWaterfallPage = !isProduction();
