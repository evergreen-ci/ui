import { isProduction, isProductionBuild } from "utils/environmentVariables";

// Show feature everywhere except for deployment at spruce.mongodb.com
export const showTaskReviewUI = !(isProduction() && isProductionBuild());
