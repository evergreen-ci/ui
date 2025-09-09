import { MessageActions, MessageActionsProps } from "@lg-chat/message-actions";

interface Props {
  handleVote?: MessageActionsProps["onRatingChange"];
}

export const MessageEvaluation: React.FC<Props> = ({ handleVote }) => (
  <MessageActions onRatingChange={handleVote} />
);
