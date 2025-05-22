import { useMutation } from "@apollo/client";
import styled from "@emotion/styled";
import Badge, { Variant as BadgeVariant } from "@leafygreen-ui/badge";
import Button, { Size as ButtonSize } from "@leafygreen-ui/button";
import IconButton from "@leafygreen-ui/icon-button";
import { palette } from "@leafygreen-ui/palette";
import { InlineCode } from "@leafygreen-ui/typography";
import { Link } from "react-router-dom";
import Accordion, {
  AccordionCaretAlign,
} from "@evg-ui/lib/components/Accordion";
import Icon from "@evg-ui/lib/components/Icon";
import { WordBreak } from "@evg-ui/lib/components/styles";
import { size } from "@evg-ui/lib/constants/tokens";
import { useToastContext } from "@evg-ui/lib/context/toast";
import { TaskStatus } from "@evg-ui/lib/types/task";
import { shortenGithash } from "@evg-ui/lib/utils/string";
import { useTaskHistoryAnalytics } from "analytics";
import { inactiveElementStyle } from "components/styles";
import { statusColorMap } from "components/TaskBox";
import { getGithubCommitUrl } from "constants/externalResources";
import { getTaskRoute } from "constants/routes";
import {
  RestartTaskMutation,
  RestartTaskMutationVariables,
} from "gql/generated/types";
import { RESTART_TASK } from "gql/mutations";
import { useDateFormat, useSpruceConfig } from "hooks";
import { useQueryParam } from "hooks/useQueryParam";
import { isProduction } from "utils/environmentVariables";
import { jiraLinkify } from "utils/string";
import { TaskHistoryTask } from "../types";
import FailedTestsTable from "./FailedTestsTable";

const { gray } = palette;

interface CommitDetailsCardProps {
  task: TaskHistoryTask;
  isCurrentTask: boolean;
  owner: string | undefined;
  repo: string | undefined;
  isMatching: boolean;
}

const CommitDetailsCard: React.FC<CommitDetailsCardProps> = ({
  isCurrentTask,
  isMatching,
  owner,
  repo,
  task,
}) => {
  const {
    canRestart,
    createTime,
    displayStatus,
    id: taskId,
    order,
    revision,
    tests,
    versionMetadata,
  } = task;
  const { author, message } = versionMetadata;

  const { sendEvent } = useTaskHistoryAnalytics();

  const spruceConfig = useSpruceConfig();
  const jiraHost = spruceConfig?.jira?.host ?? "";

  const getDateCopy = useDateFormat();
  const createDate = new Date(createTime ?? "");
  const dateCopy = getDateCopy(createDate, {
    omitSeconds: true,
    omitTimezone: true,
  });

  const githubCommitUrl =
    owner && repo && revision ? getGithubCommitUrl(owner, repo, revision) : "";

  const [, setExecution] = useQueryParam("execution", 0);

  const dispatchToast = useToastContext();

  const [restartTask] = useMutation<
    RestartTaskMutation,
    RestartTaskMutationVariables
  >(RESTART_TASK, {
    variables: { taskId, failedOnly: false },
    onCompleted: (data) => {
      dispatchToast.success("Task scheduled to restart");
      if (isCurrentTask) {
        const latestExecution = data?.restartTask.latestExecution ?? 0;
        setExecution(latestExecution);
      }
    },
    onError: (err) =>
      dispatchToast.error(`Error restarting task: ${err.message}`),
    update: (cache) => {
      if (!isCurrentTask) {
        cache.modify({
          id: cache.identify(task),
          fields: {
            canRestart: () => false,
            displayStatus: () => TaskStatus.WillRun,
            execution: (cachedExecution: number) => cachedExecution + 1,
          },
          broadcast: false,
        });
      }
    },
    // Only re-request if the current task is restarted. This should be relatively
    // uncommon.
    refetchQueries: [isCurrentTask ? "TaskHistory" : ""],
  });

  const title = (
    <BottomLabel>
      <AuthorLabel>{author} - </AuthorLabel>
      <WordBreak>{jiraLinkify(message, jiraHost)}</WordBreak>
    </BottomLabel>
  );

  return (
    <CommitCard
      key={taskId}
      data-cy="commit-details-card"
      isMatching={isMatching}
      status={displayStatus as TaskStatus}
    >
      <TopLabel>
        <InlineCode
          as={Link}
          data-cy="downstream-base-commit"
          to={getTaskRoute(taskId)}
        >
          {shortenGithash(revision ?? "")}
        </InlineCode>
        <IconButton
          aria-label="GitHub Commit Link"
          href={githubCommitUrl}
          target="__blank"
        >
          <Icon glyph="GitHub" />
        </IconButton>
        <Button
          data-cy="restart-button"
          disabled={!canRestart}
          onClick={() => restartTask()}
          size={ButtonSize.XSmall}
        >
          Restart Task
        </Button>
        {isCurrentTask && <Badge variant={BadgeVariant.Blue}>This Task</Badge>}
        <span>{dateCopy}</span>
        {/* Use this to debug issues with pagination. */}
        {!isProduction() && <OrderLabel>Order: {order}</OrderLabel>}
      </TopLabel>
      {tests.testResults.length > 0 ? (
        <Accordion
          caretAlign={AccordionCaretAlign.Start}
          onToggle={({ isVisible }) =>
            sendEvent({ name: "Toggled failed tests table", open: isVisible })
          }
          title={title}
        >
          <FailedTestsTable tests={tests} />
        </Accordion>
      ) : (
        title
      )}
    </CommitCard>
  );
};

export default CommitDetailsCard;

const CommitCard = styled.div<{
  status: TaskStatus;
  isMatching: boolean;
}>`
  display: flex;
  flex-direction: column;
  gap: ${size.xs};

  padding: ${size.xs};
  border-radius: ${size.xs};
  border: 1px solid ${gray.light2};

  ${({ status }) => `border-left: ${size.xs} solid ${statusColorMap[status]};`}

  ${({ isMatching }) => !isMatching && inactiveElementStyle}
`;

const TopLabel = styled.div`
  display: flex;
  align-items: center;
  gap: ${size.xxs};
`;

const OrderLabel = styled.div`
  margin-left: auto;
`;

const AuthorLabel = styled.b`
  flex-shrink: 0;
`;

const BottomLabel = styled.div`
  display: flex;
  align-items: flex-start;
  gap: ${size.xxs};
`;
