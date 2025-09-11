import {
  AuthProvider,
  AuthProviderProps,
  Login,
  useAuthContext,
} from "../Auth";
import { ChatFeed, ChatFeedProps } from "../ChatFeed";

const ChatBody: React.FC<ChatFeedProps> = (props) => {
  const { isAuthenticated } = useAuthContext();

  return isAuthenticated ? <ChatFeed {...props} /> : <Login />;
};

// Create a separate component so we can leverage useAuthContext above
export const Chat: React.FC<ChatFeedProps & AuthProviderProps> = ({
  loginUrl,
  ...rest
}) => (
  <AuthProvider loginUrl={loginUrl}>
    <ChatBody {...rest} />
  </AuthProvider>
);
