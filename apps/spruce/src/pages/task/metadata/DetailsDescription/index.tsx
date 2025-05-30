import { palette } from "@leafygreen-ui/palette";
import { zIndex } from "@evg-ui/lib/constants/tokens";
import ExpandedText from "components/ExpandedText";
import { MetadataItem, MetadataLabel } from "components/MetadataCard";
import { isFailedTaskStatus } from "utils/statuses";

const { red } = palette;

const MAX_CHAR = 100;
const DetailsDescription = ({
  description,
  failingCommand,
  isContainerTask,
  status,
}: {
  description: string;
  failingCommand: string;
  isContainerTask: boolean;
  status: string;
}) => {
  const isFailingTask = isFailedTaskStatus(status);
  const baseCopy = description || failingCommand;
  const fullText = isFailingTask
    ? `${processFailingCommand(baseCopy, isContainerTask)}`
    : `${baseCopy}`;

  const shouldTruncate = fullText.length > MAX_CHAR;
  const truncatedText = fullText.substring(0, MAX_CHAR).concat("...");

  return (
    <MetadataItem data-cy="task-metadata-description">
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
            data-cy="task-metadata-description-tooltip"
            justify="end"
            message={description}
            popoverZIndex={zIndex.tooltip}
          />
        </>
      ) : (
        fullText
      )}
    </MetadataItem>
  );
};

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
  "Task failed because spot host was unexpectedly terminated by AWS.";

export default DetailsDescription;
