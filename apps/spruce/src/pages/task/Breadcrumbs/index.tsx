import { shortenGithash } from "@evg-ui/lib/utils/string";
import { useBreadcrumbAnalytics } from "analytics";
import Breadcrumbs, { Breadcrumb } from "components/Breadcrumbs";
import { getTaskRoute, getVersionRoute } from "constants/routes";
import { useBreadcrumbRoot } from "hooks";

interface TaskPageBreadcrumbsProps {
  displayTask?: {
    displayName: string;
    execution: number;
    id: string;
  };
  patchNumber?: number;
  taskName: string;
  versionMetadata: {
    id: string;
    revision: string;
    isPatch: boolean;
    user: {
      userId: string;
      displayName?: string | null;
    };
    projectMetadata?: {
      id: string;
      identifier: string;
    } | null;
    message: string;
  };
}
const TaskPageBreadcrumbs: React.FC<TaskPageBreadcrumbsProps> = ({
  displayTask,
  patchNumber,
  taskName,
  versionMetadata,
}) => {
  const { id, isPatch, message, projectMetadata, revision, user } =
    versionMetadata;
  const breadcrumbRoot = useBreadcrumbRoot(
    isPatch,
    user,
    projectMetadata?.identifier || projectMetadata?.id || "",
  );
  const breadcrumbAnalytics = useBreadcrumbAnalytics();

  const messagePrefix = isPatch
    ? `Patch ${patchNumber}`
    : shortenGithash(revision);

  const messageBreadcrumb = {
    "data-cy": "bc-message",
    onClick: () => {
      breadcrumbAnalytics.sendEvent({
        link: "version",
        name: "Clicked link",
      });
    },
    text: `${messagePrefix} - ${message}`,
    to: getVersionRoute(id),
  };

  const displayTaskBreadcrumb = displayTask
    ? [
        {
          "data-cy": "bc-display-task",
          onClick: () => {
            breadcrumbAnalytics.sendEvent({
              link: "displayTask",
              name: "Clicked link",
            });
          },
          text: displayTask.displayName,
          to: getTaskRoute(displayTask.id, {
            execution: displayTask.execution,
          }),
        },
      ]
    : [];

  const taskBreadcrumb = {
    "data-cy": "bc-task",
    text: taskName,
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
