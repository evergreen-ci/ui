import { useState } from "react";
import styled from "@emotion/styled";
import Button from "@leafygreen-ui/button";
import { palette } from "@leafygreen-ui/palette";
import TextInput from "@leafygreen-ui/text-input";
import { Location, Navigate, useLocation } from "react-router-dom";
import { size } from "../../constants/tokens";
import { useAuthProviderContext } from "../../context/Auth";

const { green } = palette;

const getReferrer = (location: Location): string => {
  const state = location.state as { referrer?: string };
  return state?.referrer ?? "/";
};

const LoginPage: React.FC = () => {
  const location = useLocation();
  const { isAuthenticated, localLogin } = useAuthProviderContext();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  return isAuthenticated ? (
    <Navigate to={getReferrer(location)} />
  ) : (
    <PageWrapper>
      <LoginForm
        onSubmit={(e) => {
          e.preventDefault();
          localLogin({ password, username });
        }}
      >
        <TextInput
          data-cy="login-username"
          label="Username"
          onChange={(e) => setUsername(e.target.value)}
          type="text"
          value={username}
        />
        <TextInput
          data-cy="login-password"
          label="Password"
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          value={password}
        />
        <StyledButton
          data-cy="login-submit"
          onClick={() => localLogin({ password, username })}
          type="submit"
          variant="baseGreen"
        >
          Login
        </StyledButton>
      </LoginForm>
    </PageWrapper>
  );
};

const PageWrapper = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const LoginForm = styled.form`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: ${size.s};

  width: 400px;
  padding: ${size.l} ${size.m};
  background-color: ${green.light3};
  border-radius: ${size.m};
`;

const StyledButton = styled(Button)`
  align-self: flex-end;
`;

export default LoginPage;
