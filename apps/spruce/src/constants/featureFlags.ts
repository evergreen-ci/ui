import { isEndUserProduction } from "utils/environmentVariables";

// Show feature everywhere except for deployment at spruce.mongodb.com
export const showTaskReviewUI = !isEndUserProduction();
