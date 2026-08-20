import { isEndUserProduction } from "utils/environmentVariables";

export const showTaskOwnershipTab = !isEndUserProduction();
