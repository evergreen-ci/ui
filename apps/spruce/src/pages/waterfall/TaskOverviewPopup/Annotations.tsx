import styled from "@emotion/styled";
import { palette } from "@leafygreen-ui/palette";
import { StyledLink, wordBreakCss } from "@evg-ui/lib/components/styles";
import { size } from "@evg-ui/lib/constants/tokens";
import { Unpacked } from "@evg-ui/lib/types/utils";
import { MetadataCardTitle } from "components/MetadataCard";
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
    <MetadataCardTitle weight="bold">Failing Tasks</MetadataCardTitle>
    <TasksList>
      {tasks.map((t) => (
        <TaskListItem key={t}>
          <TaskName>{t}</TaskName>
        </TaskListItem>
      ))}
    </TasksList>
  </FailingTasksContainer>
);

const FailingTasksContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${size.xxs};
`;

const TasksList = styled.ul`
  margin: 0;
  padding: 0 ${size.s};
`;

const TaskListItem = styled.li`
  margin-bottom: 2px;
`;

const TaskName = styled.span`
  background-color: ${palette.gray.light2};
  border-radius: ${size.xxs};
  word-break: break-all;
`;

interface AnnotationProps {
  annotation: Annotation;
}

export const Annotations: React.FC<AnnotationProps> = ({ annotation }) => {
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

  return (
    <AnnotationsContainer>
      {hasIssues && (
        <IssuesContainer>
          <MetadataCardTitle weight="bold">Associated Issues</MetadataCardTitle>
          <IssueLinks issues={allIssues} />
        </IssuesContainer>
      )}
      {failingTasks && <FailingTasks tasks={failingTasks} />}
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
