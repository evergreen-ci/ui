import { SingleTaskDistroQuery } from "gql/generated/types";

export const gqlToForm = (data?: SingleTaskDistroQuery) => {
  const sortedProjectTasksPairs = (
    data?.spruceConfig?.singleTaskDistro?.projectTasksPairs || []
  )
    .map(({ allowedBVs, allowedTasks, displayName, projectId }) => ({
      allowedBVs: [...allowedBVs].sort(),
      allowedTasks: [...allowedTasks].sort(),
      displayTitle: displayName,
      projectId,
    }))
    .sort((a, b) => a.displayTitle.localeCompare(b.displayTitle));
  return {
    projectTasksPairs: sortedProjectTasksPairs,
  };
};
