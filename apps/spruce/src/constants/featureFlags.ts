/* eslint-disable */
// Remove above line if adding new feature flag.
import { isEndUserProduction } from "utils/environmentVariables";
export const showRecreatableTaskEnvironments = !isEndUserProduction();