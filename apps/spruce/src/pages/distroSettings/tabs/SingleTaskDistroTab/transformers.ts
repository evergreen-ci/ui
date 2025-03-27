import { SingleTaskDistroQuery } from "gql/generated/types";

export const gqlToForm = (data?: SingleTaskDistroQuery) => {
  const sortedProjectTasksPairs = (
    data?.spruceConfig?.singleTaskDistro?.projectTasksPairs || []
  )
    .map(({ allowedTasks, projectId }) => ({
      displayTitle: projectId,
      allowedTasks: [...allowedTasks].sort(),
    }))
    .sort((a, b) => a.displayTitle.localeCompare(b.displayTitle));
  return {
    projectTasksPairs: sortedProjectTasksPairs,
  };
};
