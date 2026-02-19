import styled from "@emotion/styled";
import {
  Chip,
  TruncationLocation,
  Variant as ChipVariant,
} from "@leafygreen-ui/chip";
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

const FailingTasks: React.FC<{
  tasks: string[];
}> = ({ tasks }) => (
  <FailingTasksContainer>
    <MetadataCardTitle weight="bold">Failing Tasks</MetadataCardTitle>
    <TasksList>
      {tasks.map((t) => (
        <Chip
          key={t}
          chipCharacterLimit={42}
          chipTruncationLocation={TruncationLocation.End}
          label={t}
          variant={ChipVariant.Gray}
        />
      ))}
    </TasksList>
  </FailingTasksContainer>
);

interface AnnotationProps {
  annotation: Annotation;
}

export const Annotations: React.FC<AnnotationProps> = ({ annotation }) => {
  if (!hasAnnotations(annotation)) {
    return null;
  }

  const { createdIssues, issues, suspectedIssues } = annotation || {};
  const { failingTasks } = annotation?.issues?.[0]?.jiraTicket?.fields || {};
  return (
    <AnnotationsContainer>
      <IssuesContainer>
        <MetadataCardTitle weight="bold">Associated Issues</MetadataCardTitle>
        {createdIssues && <IssueLinks issues={createdIssues} />}
        {issues && <IssueLinks issues={issues} />}
        {suspectedIssues && <IssueLinks issues={suspectedIssues} />}
      </IssuesContainer>
      {failingTasks && <FailingTasks tasks={failingTasks} />}
    </AnnotationsContainer>
  );
};

const FailingTasksContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${size.xxs};
`;

const TasksList = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: ${size.xxs};
`;

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

const AnnotationLink = styled(StyledLink)`
  font-weight: bold;
  ${wordBreakCss};
`;
