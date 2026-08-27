import { SingleTaskDistroQuery } from "gql/generated/types";

export const gqlToForm = (data?: SingleTaskDistroQuery) => {
  const sortedProjectTasksPairs = (
    data?.spruceConfig?.singleTaskDistro?.projectTasksPairs || []
  )
    .map(({ allowedBVs, allowedTasks, displayName, isRegex, projectId }) => ({
      displayTitle: displayName,
      projectId,
      isRegex: isRegex ?? false,
      allowedTasks: [...allowedTasks].sort(),
      allowedBVs: [...allowedBVs].sort(),
    }))
    .sort((a, b) => a.displayTitle.localeCompare(b.displayTitle));
  return {
    projectTasksPairs: sortedProjectTasksPairs,
  };
};
