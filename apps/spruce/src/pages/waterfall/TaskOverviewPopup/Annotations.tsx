import styled from "@emotion/styled";
import { Chip } from "@leafygreen-ui/chip";
import { StyledLink, wordBreakCss } from "@evg-ui/lib/components/styles";
import { size } from "@evg-ui/lib/constants/tokens";
import { Unpacked } from "@evg-ui/lib/types/utils";
import { TaskOverviewPopupQuery } from "gql/generated/types";

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
      <AnnotationLink key={i.issueKey} hideExternalIcon={false} href={i.url}>
        {i.issueKey}
      </AnnotationLink>
    ) : null,
  );

const AnnotationLink = styled(StyledLink)`
  font-weight: bold;
  ${wordBreakCss};
`;

const FailingTasks: React.FC<{
  tasks: string[];
}> = ({ tasks }) => (
  <FailingTasksContainer>
    <details>
      <FailingTasksSummary>
        <b>Other Failing Tasks ({tasks.length})</b>
      </FailingTasksSummary>
      <TasksList>
        {tasks.map((t) => (
          <TaskListItem key={t}>
            <Chip
              chipCharacterLimit={45}
              chipTruncationLocation="end"
              label={t}
              variant="gray"
            />
          </TaskListItem>
        ))}
      </TasksList>
    </details>
  </FailingTasksContainer>
);

const FailingTasksContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${size.xxs};
`;

const FailingTasksSummary = styled.summary`
  :hover {
    cursor: pointer;
  }
`;

const TasksList = styled.ul`
  margin: 0;
  margin-top: ${size.xs};
  padding: 0 ${size.s};
`;

const TaskListItem = styled.li`
  margin-bottom: ${size.xs};
  word-break: break-all;
  line-height: 1.2;
`;

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
    <AnnotationsContainer>
      {hasIssues && (
        <IssuesContainer>
          <b>Associated Issues</b>
          <LinksContainer>
            <IssueLinks issues={allIssues} />
          </LinksContainer>
        </IssuesContainer>
      )}
      {otherFailingTasks.length > 0 && (
        <FailingTasks tasks={otherFailingTasks} />
      )}
    </AnnotationsContainer>
  );
};

const AnnotationsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${size.xxs};
`;

const IssuesContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${size.xxs};
`;

const LinksContainer = styled.div`
  display: flex;
  gap: ${size.s};
`;
