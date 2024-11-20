import { isProduction } from "utils/environmentVariables";

export const showWaterfallPage = !isProduction();
