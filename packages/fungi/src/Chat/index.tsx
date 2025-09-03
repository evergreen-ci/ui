import {
  AuthProvider,
  AuthProviderProps,
  Login,
  useAuthContext,
} from "../Auth";
import { ChatFeed } from "../ChatFeed";

type ChatProps = {
  apiUrl: string;
  bodyData?: object;
};

const ChatBody: React.FC<ChatProps> = ({ apiUrl, bodyData }) => {
  const { isAuthenticated } = useAuthContext();

  return isAuthenticated ? (
    <ChatFeed apiUrl={apiUrl} bodyData={bodyData} />
  ) : (
    <Login />
  );
};

// Create a separate component so we can leverage useAuthContext above
export const Chat: React.FC<
  ChatProps & Pick<AuthProviderProps, "loginUrl">
> = ({ loginUrl, ...rest }) => (
  <AuthProvider loginUrl={loginUrl}>
    <ChatBody {...rest} />
  </AuthProvider>
);
