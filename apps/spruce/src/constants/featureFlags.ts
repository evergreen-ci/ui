import { isEndUserProduction } from "utils/environmentVariables";

export const showRecreatableTaskEnvironments = !isEndUserProduction();
// TODO DEVPROD-8355: remove feature flag and its references
export const showNewProjectNavigation = !isEndUserProduction();
