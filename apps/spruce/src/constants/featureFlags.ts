import { isEndUserProduction } from "utils/environmentVariables";

export const showNewProjectNavigation = !isEndUserProduction();
