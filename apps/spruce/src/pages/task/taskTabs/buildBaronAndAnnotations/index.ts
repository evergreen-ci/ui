import { loadable } from "components/SpruceLoader";
import { useShowBuildBaron } from "./useShowBuildBaron";

const BuildBaron = loadable(() => import("./BuildBaron"));
export { useShowBuildBaron };

export default BuildBaron;
