import { isEndUserProduction } from "utils/environmentVariables";

export const showRecreatableTaskEnvironments = !isEndUserProduction();
