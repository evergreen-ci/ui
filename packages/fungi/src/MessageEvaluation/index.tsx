import { MessageActions, MessageActionsProps } from "@lg-chat/message-actions";

export type MessageEvalProps = Pick<MessageActionsProps, "onRatingChange">;

export const MessageEvaluation: React.FC<MessageEvalProps> = ({
  onRatingChange,
}) => <MessageActions onRatingChange={onRatingChange} />;
