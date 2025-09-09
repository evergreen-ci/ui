import { isProduction, isProductionBuild } from "utils/environmentVariables";

export const showAI = !(isProduction() && isProductionBuild());
