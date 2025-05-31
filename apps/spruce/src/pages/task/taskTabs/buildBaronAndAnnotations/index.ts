import { loadable } from "components/SpruceLoader";
import useBuildBaronVariables from "./useBuildBaronVariables";

const BuildBaron = loadable(() => import("./BuildBaron"));
export { useBuildBaronVariables };

export default BuildBaron;
