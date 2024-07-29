import { useBreadcrumbAnalytics } from "analytics";
import Breadcrumbs, { Breadcrumb } from "components/Breadcrumbs";
import { getTaskRoute, getVersionRoute } from "constants/routes";
import { useBreadcrumbRoot } from "hooks";
import { shortenGithash } from "utils/string";

interface TaskPageBreadcrumbsProps {
  displayTask?: {
    displayName: string;
    execution: number;
    id: string;
  };
  patchNumber?: number;
  taskName: string;
  versionMetadata?: {
    id: string;
    revision: string;
    project: string;
    isPatch: boolean;
    author: string;
    projectIdentifier: string;
    message: string;
  };
}
const TaskPageBreadcrumbs: React.FC<TaskPageBreadcrumbsProps> = ({
  displayTask,
  patchNumber,
  taskName,
  versionMetadata,
}) => {
  const { author, id, isPatch, message, projectIdentifier, revision } =
    versionMetadata ?? {};
  // @ts-expect-error: FIXME. This comment was added by an automated script.
  const breadcrumbRoot = useBreadcrumbRoot(isPatch, author, projectIdentifier);
  const breadcrumbAnalytics = useBreadcrumbAnalytics();

  const messagePrefix = isPatch
    ? `Patch ${patchNumber}`
    : // @ts-expect-error: FIXME. This comment was added by an automated script.
      shortenGithash(revision);

  const messageBreadcrumb = {
    // @ts-expect-error: FIXME. This comment was added by an automated script.
    to: getVersionRoute(id),
    text: `${messagePrefix} - ${message}`,
    onClick: () => {
      breadcrumbAnalytics.sendEvent({
        name: "Clicked link",
        link: "version",
      });
    },
    "data-cy": "bc-message",
  };

  const displayTaskBreadcrumb = displayTask
    ? [
        {
          to: getTaskRoute(displayTask.id, {
            execution: displayTask.execution,
          }),
          text: displayTask.displayName,
          onClick: () => {
            breadcrumbAnalytics.sendEvent({
              name: "Clicked link",
              link: "displayTask",
            });
          },
          "data-cy": "bc-display-task",
        },
      ]
    : [];

  const taskBreadcrumb = {
    text: taskName,
    "data-cy": "bc-task",
  };

  const breadcrumbs: Breadcrumb[] = [
    // @ts-expect-error: FIXME. This comment was added by an automated script.
    breadcrumbRoot,
    messageBreadcrumb,
    ...displayTaskBreadcrumb,
    taskBreadcrumb,
  ];

  return <Breadcrumbs breadcrumbs={breadcrumbs} />;
};

export default TaskPageBreadcrumbs;
