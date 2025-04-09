import { useMutation } from "@apollo/client";
import styled from "@emotion/styled";
import Badge, { Variant as BadgeVariant } from "@leafygreen-ui/badge";
import Button, { Size as ButtonSize } from "@leafygreen-ui/button";
import IconButton from "@leafygreen-ui/icon-button";
import { palette } from "@leafygreen-ui/palette";
import { InlineCode } from "@leafygreen-ui/typography";
import { Link } from "react-router-dom";
import Icon from "@evg-ui/lib/components/Icon";
import { size } from "@evg-ui/lib/constants/tokens";
import { useToastContext } from "@evg-ui/lib/context/toast";
import { TaskStatus } from "@evg-ui/lib/types/task";
import { statusColorMap } from "components/TaskBox";
import { getGithubCommitUrl } from "constants/externalResources";
import { getTaskRoute } from "constants/routes";
import {
  RestartTaskMutation,
  RestartTaskMutationVariables,
} from "gql/generated/types";
import { RESTART_TASK } from "gql/mutations";
import { useDateFormat, useSpruceConfig } from "hooks";
import { isProduction } from "utils/environmentVariables";
import { jiraLinkify, shortenGithash } from "utils/string";
import { TaskHistoryTask } from "../types";

const { gray } = palette;

interface CommitDetailsCardProps {
  task: TaskHistoryTask;
  isCurrentTask: boolean;
  // TODO DEVPROD-16175: Instead of requesting these fields in TaskHistory query, pass these fields down from the single
  // Task query. This will reduce duplicated query work since all tasks on the project should come from the same repo.
  owner: string | undefined;
  repo: string | undefined;
}

const CommitDetailsCard: React.FC<CommitDetailsCardProps> = ({
  isCurrentTask,
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
    versionMetadata,
  } = task;
  const { author, message } = versionMetadata;

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

  const dispatchToast = useToastContext();

  const [restartTask] = useMutation<
    RestartTaskMutation,
    RestartTaskMutationVariables
  >(RESTART_TASK, {
    variables: { taskId, failedOnly: false },
    onCompleted: () => dispatchToast.success("Task scheduled to restart"),
    onError: (err) =>
      dispatchToast.error(`Error restarting task: ${err.message}`),
  });

  return (
    <CommitCard
      key={taskId}
      data-cy="commit-details-card"
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
      <BottomLabel>
        <AuthorLabel>{author} - </AuthorLabel>
        <span>{jiraLinkify(message, jiraHost)}</span>
      </BottomLabel>
    </CommitCard>
  );
};

export default CommitDetailsCard;

const CommitCard = styled.div<{ status: TaskStatus }>`
  display: flex;
  flex-direction: column;
  gap: ${size.xs};

  padding: ${size.xs};
  border-radius: ${size.xs};
  border: 1px solid ${gray.light2};

  ${({ status }) => `border-left: ${size.xs} solid ${statusColorMap[status]};`}
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
