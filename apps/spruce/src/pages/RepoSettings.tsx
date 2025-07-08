import { loadable } from "components/SpruceLoader";

export const RepoSettings = loadable(
  () => import("./projectAndRepoSettings/RepoSettings"),
);
