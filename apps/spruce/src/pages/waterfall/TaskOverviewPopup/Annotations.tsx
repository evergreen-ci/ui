import { StyledLink } from "@evg-ui/lib/components/styles";
import { Unpacked } from "@evg-ui/lib/types/utils";
import { TaskOverviewPopupQuery } from "gql/generated/types";
import styles from "./Annotations.module.css";

type Annotation = NonNullable<TaskOverviewPopupQuery["task"]>["annotation"];
type Issue = Unpacked<
  NonNullable<Annotation>["createdIssues" | "issues" | "suspectedIssues"]
>;

export const hasAnnotations = (annotation: Annotation) =>
  (annotation?.createdIssues && annotation.createdIssues.length > 0) ||
  (annotation?.issues && annotation.issues.length > 0) ||
  (annotation?.suspectedIssues && annotation.suspectedIssues.length > 0);

const IssueLinks: React.FC<{
  issues: Issue[];
}> = ({ issues }) =>
  issues.map((i) =>
    i?.issueKey && i?.url ? (
      <StyledLink
        key={i.issueKey}
        className={styles.annotationLink}
        hideExternalIcon={false}
        href={i.url}
      >
        {i.issueKey}
      </StyledLink>
    ) : null,
  );

const FailingTasks: React.FC<{
  tasks: string[];
}> = ({ tasks }) => (
  <div className={styles.failingTasksContainer}>
    <details>
      <summary className={styles.failingTasksSummary}>
        <b>Other Failing Tasks ({tasks.length})</b>
      </summary>
      <ul className={styles.tasksList}>
        {tasks.map((t) => (
          <li key={t} className={styles.taskListItem}>
            {t}
          </li>
        ))}
      </ul>
    </details>
  </div>
);

interface AnnotationProps {
  annotation: Annotation;
  displayName?: string;
}

export const Annotations: React.FC<AnnotationProps> = ({
  annotation,
  displayName,
}) => {
  if (!annotation) {
    return null;
  }

  const hasIssues = hasAnnotations(annotation);
  const { createdIssues, issues, suspectedIssues } = annotation;

  const allIssues = [
    ...(createdIssues || []),
    ...(issues || []),
    ...(suspectedIssues || []),
  ];

  const { failingTasks } = issues?.[0]?.jiraTicket?.fields || {};
  const otherFailingTasks =
    failingTasks
      ?.filter((t) => t !== displayName)
      .sort((a, b) => a.localeCompare(b)) ?? [];

  return (
    <div className={styles.annotationsContainer}>
      {hasIssues && (
        <div className={styles.issuesContainer}>
          <b>Associated Issues</b>
          <div className={styles.linksContainer}>
            <IssueLinks issues={allIssues} />
          </div>
        </div>
      )}
      {otherFailingTasks.length > 0 && (
        <FailingTasks tasks={otherFailingTasks} />
      )}
    </div>
  );
};
