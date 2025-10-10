import { isEndUserProduction } from "utils/environmentVariables";

export const showTestSelectionUI = !isEndUserProduction();
