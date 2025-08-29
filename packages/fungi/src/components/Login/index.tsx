import styled from "@emotion/styled";
import Button, { Variant } from "@leafygreen-ui/button";

interface LoginProps {
  onLogin: () => void;
  loginUrl?: string;
  appName: string;
  disabled: boolean;
}

const Login: React.FC<LoginProps> = ({
  appName,
  disabled,
  loginUrl,
  onLogin,
}) => (
  <Container>
    <MessageText>{appName} requires you to login separately</MessageText>
    <Button
      as="a"
      disabled={disabled}
      href={loginUrl}
      onClick={onLogin}
      target="_blank"
      variant={Variant.BaseGreen}
    >
      {disabled ? "Waiting for login..." : "Click here to login"}
    </Button>
  </Container>
);

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
`;

const MessageText = styled.div`
  font-size: 14px;
  line-height: 20px;
  margin-bottom: 16px;
  text-align: center;
`;

export default Login;
