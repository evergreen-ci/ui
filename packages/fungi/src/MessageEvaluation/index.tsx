import { MessageActions, MessageActionsProps } from "@lg-chat/message-actions";

export interface MessageEvalProps {
  handleVote?: MessageActionsProps["onRatingChange"];
}

export const MessageEvaluation: React.FC<MessageEvalProps> = ({
  handleVote,
}) => <MessageActions onRatingChange={handleVote} />;
