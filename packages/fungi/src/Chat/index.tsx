import { AuthProvider, AuthProviderProps, Login, useAuthContext } from "#Auth";
import { ChatFeed, ChatFeedProps } from "#ChatFeed";

export { MessageRatingValue } from "@lg-chat/message-rating";

const ChatBody: React.FC<ChatFeedProps> = (props) => {
  const { isAuthenticated } = useAuthContext();

  return isAuthenticated ? <ChatFeed {...props} /> : <Login />;
};

export type ChatProps = ChatFeedProps & AuthProviderProps;

// Create a separate component so we can leverage useAuthContext above
export const Chat: React.FC<ChatProps> = ({ loginUrl, ...rest }) => (
  <AuthProvider loginUrl={loginUrl}>
    <ChatBody {...rest} />
  </AuthProvider>
);
