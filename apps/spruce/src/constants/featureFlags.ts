import { isEndUserProduction } from "utils/environmentVariables";

// TODO DEVPROD-31534: remove feature flag and its references
export const showNewProjectNavigation = !isEndUserProduction();
