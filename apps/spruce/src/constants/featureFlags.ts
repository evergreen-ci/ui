import Cookies from "js-cookie";
import { isProduction, isProductionBuild } from "utils/environmentVariables";
import { DISABLE_TASK_REVIEW } from "./cookies";

// When not disabled, show feature everywhere except for deployment at spruce.mongodb.com
export const showTaskReviewUI =
  Cookies.get(DISABLE_TASK_REVIEW) !== "true" &&
  !(isProduction() && isProductionBuild());
