import styled from "@emotion/styled";
import { Chip, Variant as ChipVariant } from "@leafygreen-ui/chip";
import { palette } from "@leafygreen-ui/palette";
import { size } from "@evg-ui/lib/constants/tokens";
import ExpandedText from "components/ExpandedText";
import { MetadataItem, MetadataLabel } from "components/MetadataCard";
import { TaskEndDetail } from "gql/generated/types";
import { isFailedTaskStatus } from "utils/statuses";

const { red } = palette;

const MAX_CHAR = 100;

export const DetailsDescription = ({
  details,
  isPushCompleted = false,
}: {
  details: TaskEndDetail;
  isPushCompleted?: boolean;
}) => {
  const {
    description,
    failingCommand,
    otherFailingCommands,
    status,
    systemFailureReason,
  } = details ?? {};
  const isFailingTask = isFailedTaskStatus(status);
  const baseCopy = description || failingCommand || "";
  const fullText = isFailingTask
    ? processFailingCommand(baseCopy, isPushCompleted, systemFailureReason)
    : baseCopy;
  const isSystemFailure =
    isFailingTask &&
    (!!systemFailureReason ||
      baseCopy === strandedDescription ||
      baseCopy === heartbeatDescription);

  const shouldTruncate = fullText.length > MAX_CHAR;
  const truncatedText = fullText.substring(0, MAX_CHAR).concat("...");

  let label = "Command";
  if (isSystemFailure) {
    label = "Failure reason";
  } else if (isFailingTask) {
    label = "Failing command";
  }

  return (
    <>
      <MetadataItem
        data-testid="task-metadata-command"
        label={label}
        labelColor={isFailingTask ? red.base : undefined}
        orientation={isFailingTask ? "vertical" : "horizontal"}
      >
        {shouldTruncate ? (
          <>
            {truncatedText}{" "}
            <ExpandedText
              align="right"
              data-testid="task-metadata-command-tooltip"
              justify="end"
              message={fullText}
            />
          </>
        ) : (
          fullText
        )}
      </MetadataItem>
      {otherFailingCommands.length > 0 ? (
        <MetadataItem data-testid="task-metadata-other-failing-commands">
          <details>
            <MetadataSummary data-testid="other-failing-commands-summary">
              <MetadataLabel>
                Other Failing Commands ({otherFailingCommands.length})
              </MetadataLabel>
            </MetadataSummary>
            <OtherFailingCommandContainer>
              {otherFailingCommands.map(
                ({ failureMetadataTags, fullDisplayName }) => (
                  <OtherFailingCommand key={fullDisplayName}>
                    {fullDisplayName}
                    <ChipContainer>
                      {failureMetadataTags.map((t) => (
                        <Chip
                          key={`${fullDisplayName}-${t}`}
                          label={t}
                          variant={ChipVariant.Gray}
                        />
                      ))}
                    </ChipContainer>
                  </OtherFailingCommand>
                ),
              )}
            </OtherFailingCommandContainer>
          </details>
        </MetadataItem>
      ) : null}
    </>
  );
};

const MetadataSummary = styled.summary`
  :hover {
    cursor: pointer;
  }
`;

const OtherFailingCommandContainer = styled.ul`
  display: flex;
  flex-direction: column;
  gap: ${size.xxs};
  padding-left: ${size.s};
  margin: ${size.xs} 0 0 0;
`;

const OtherFailingCommand = styled.li``;

const ChipContainer = styled.div`
  margin-top: ${size.xxs};
  display: flex;
  gap: ${size.xxs};
  flex-wrap: wrap;
`;

const processFailingCommand = (
  description: string,
  isPushCompleted: boolean,
  systemFailureReason: string | null | undefined,
): string => {
  if (systemFailureReason) {
    return (
      systemFailureReason.charAt(0).toUpperCase() + systemFailureReason.slice(1)
    );
  }
  if (description === strandedDescription) {
    return isPushCompleted
      ? virtualTaskStrandedMessage
      : hostTaskStrandedMessage;
  }
  if (description === heartbeatDescription) {
    return heartbeatMessage;
  }
  return description;
};

const strandedDescription = "stranded";

const heartbeatDescription = "heartbeat";

const hostTaskStrandedMessage =
  "Task failed because the host became unreachable unexpectedly";

const virtualTaskStrandedMessage =
  "Virtual task failed because the runner task did not set a status for it";

const heartbeatMessage = "Task failed because it stopped sending heartbeats";
