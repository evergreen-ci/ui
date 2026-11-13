import { isEndUserProduction } from "utils/environmentVariables";

export const showSelectableTaskRows = !isEndUserProduction();
