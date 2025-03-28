import { SingleTaskDistroQuery } from "gql/generated/types";

export const gqlToForm = (data?: SingleTaskDistroQuery) => {
  const sortedProjectTasksPairs = (
    data?.spruceConfig?.singleTaskDistro?.projectTasksPairs || []
  )
    .map(({ allowedBVs, allowedTasks, projectId }) => ({
      displayTitle: projectId,
      allowedTasks: [...allowedTasks].sort(),
      allowedBVs: [...allowedBVs].sort(),
    }))
    .sort((a, b) => a.displayTitle.localeCompare(b.displayTitle));
  return {
    projectTasksPairs: sortedProjectTasksPairs,
  };
};
