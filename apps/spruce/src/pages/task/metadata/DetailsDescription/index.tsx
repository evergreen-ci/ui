import styled from "@emotion/styled";
import { Chip, Variant as ChipVariant } from "@leafygreen-ui/chip";
import { palette } from "@leafygreen-ui/palette";
import { size } from "@evg-ui/lib/constants";
import ExpandedText from "components/ExpandedText";
import { MetadataItem, MetadataLabel } from "components/MetadataCard";
import { TaskEndDetail } from "gql/generated/types";
import { isFailedTaskStatus } from "utils/statuses";

const { red } = palette;

const MAX_CHAR = 100;
const DetailsDescription = ({
  details,
  isContainerTask,
}: {
  details: TaskEndDetail;
  isContainerTask: boolean;
}) => {
  const { description, failingCommand, otherFailingCommands, status } =
    details ?? {};
  const isFailingTask = isFailedTaskStatus(status);
  const baseCopy = description || failingCommand || "";
  const fullText = isFailingTask
    ? `${processFailingCommand(baseCopy, isContainerTask)}`
    : `${baseCopy}`;

  const shouldTruncate = fullText.length > MAX_CHAR;
  const truncatedText = fullText.substring(0, MAX_CHAR).concat("...");

  return (
    <>
      <MetadataItem data-cy="task-metadata-command">
        {isFailingTask ? (
          <MetadataLabel color={red.base}>Failing Command: </MetadataLabel>
        ) : (
          <MetadataLabel>Command: </MetadataLabel>
        )}
        {shouldTruncate ? (
          <>
            {truncatedText}{" "}
            <ExpandedText
              align="right"
              data-cy="task-metadata-command-tooltip"
              justify="end"
              message={description ?? ""}
            />
          </>
        ) : (
          fullText
        )}
      </MetadataItem>
      {otherFailingCommands.length > 0 ? (
        <MetadataItem data-cy="task-metadata-other-failing-commands">
          <details>
            <MetadataSummary data-cy="other-failing-commands-summary">
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
  isContainerTask: boolean,
): string => {
  if (description === "stranded") {
    return isContainerTask
      ? containerTaskStrandedMessage
      : hostTaskStrandedMessage;
  }
  return description;
};

const containerTaskStrandedMessage =
  "Task failed because the container was stranded by the ECS agent.";
const hostTaskStrandedMessage =
  "Task failed because the host became unreachable unexpectedly";

export default DetailsDescription;
