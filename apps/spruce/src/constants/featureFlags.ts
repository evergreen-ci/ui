import { isProduction } from "utils/environmentVariables";

const showTaskHistoryTab = !isProduction();

export { showTaskHistoryTab };
