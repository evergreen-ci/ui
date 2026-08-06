import { useProjectBuildBaronSettings } from "hooks";
import { statuses } from "utils";

const { isFailedTaskStatus } = statuses;

interface UseShowBuildBaronOptions {
  status: string;
  hasAnnotation: boolean;
  canModifyAnnotation: boolean;
  projectId?: string;
  projectIdentifier?: string;
}

/**
 * useShowBuildBaron decides whether the Failure Details tab should exist for a task, based on the
 * project's current Build Baron settings. This is the one place that fetches those settings;
 * everything inside the tab reads them from the cache.
 * @param options - the options object
 * @param options.status - the task's display status
 * @param options.hasAnnotation - whether the task has an annotation
 * @param options.canModifyAnnotation - whether the user may modify the task's annotation
 * @param options.projectId - the id of the task's project
 * @param options.projectIdentifier - the identifier of the task's project
 * @returns whether to show the Failure Details tab
 */
export const useShowBuildBaron = ({
  canModifyAnnotation,
  hasAnnotation,
  projectId,
  projectIdentifier,
  status,
}: UseShowBuildBaronOptions): boolean => {
  const isFailedTask = isFailedTaskStatus(status);

  const { buildBaronConfigured } = useProjectBuildBaronSettings({
    projectId,
    projectIdentifier: isFailedTask ? projectIdentifier : undefined,
  });

  return (
    isFailedTask &&
    (buildBaronConfigured || hasAnnotation || canModifyAnnotation)
  );
};
