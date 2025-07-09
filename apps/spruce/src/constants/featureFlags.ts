import { isProduction } from "utils/environmentVariables";

export const showTaskReviewedUI = !isProduction();
