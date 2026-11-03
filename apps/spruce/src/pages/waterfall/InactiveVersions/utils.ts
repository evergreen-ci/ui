import { Requester } from "constants/requesters";
import { ModuleGroup, Version } from "../types";

/**
 * `groupModules` collapses consecutive module commits (triggered versions) that share the
 * revision of the commit they're based on. Non-trigger versions are in their own group.
 * @param versions The list of versions to group by module.
 * @returns Trigger versions grouped by module, with non-trigger versions in their own group.
 */
export const groupModules = (versions: Version[]): ModuleGroup[] =>
  versions.reduce<ModuleGroup[]>((groups, version) => {
    const isModule = version.requester === Requester.Trigger;
    const lastGroup = groups[groups.length - 1];
    if (
      isModule &&
      lastGroup?.isModule &&
      lastGroup.versions[0].revision === version.revision
    ) {
      lastGroup.versions.push(version);
    } else {
      groups.push({ isModule, versions: [version] });
    }
    return groups;
  }, []);
