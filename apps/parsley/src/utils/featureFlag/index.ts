import { isProduction } from "utils/environmentVariables";

export const releaseSectioning = !isProduction();
