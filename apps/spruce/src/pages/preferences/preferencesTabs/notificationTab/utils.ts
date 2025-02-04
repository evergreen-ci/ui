import {
  getCommitsRoute,
  getPatchRoute,
  getTaskRoute,
  getVersionRoute,
  getWaterfallRoute,
} from "constants/routes";
import { Selector } from "gql/generated/types";
import { ResourceType } from "types/triggers";

export const getResourceRoute = (
  resourceType: ResourceType,
  selector: Selector,
  spruceWaterfallEnabled: boolean = false,
) => {
  const { data: id, type } = selector;

  if (!id) {
    return "";
  }

  switch (resourceType) {
    case ResourceType.Build:
    case ResourceType.Version: {
      if (type === "project") {
        return spruceWaterfallEnabled
          ? getWaterfallRoute(id)
          : getCommitsRoute(id);
      }
      return getVersionRoute(id);
    }
    case ResourceType.Patch:
      return getPatchRoute(id, { configure: false });
    case ResourceType.Task:
      return getTaskRoute(id);
    default:
      return "";
  }
};
