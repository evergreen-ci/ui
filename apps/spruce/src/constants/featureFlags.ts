import Cookies from "js-cookie";
import { isEndUserProduction } from "utils/environmentVariables";
import { DISABLE_TASK_REVIEW } from "./cookies";

// When not disabled, show feature everywhere except for deployment at spruce.mongodb.com
export const showTaskReviewUI =
  Cookies.get(DISABLE_TASK_REVIEW) !== "true" && !isEndUserProduction();

export const showTestSelectionUI = !isEndUserProduction();
