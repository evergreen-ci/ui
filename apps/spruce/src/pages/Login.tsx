import { useEffect, useState } from "react";
import styled from "@emotion/styled";
import { Navigate, useLocation } from "react-router-dom";
import { fetchWithRetry } from "@evg-ui/lib/utils/request";
import { useAuthDispatchContext, useAuthStateContext } from "context/Auth";
import { secretFieldsReq } from "gql/fetch";
import { getGQLUrl } from "utils/environmentVariables";

type LocationState = {
  referrer?: string;
};

const getReferrer = (location: LocationState): string => {
  const locationState = location as LocationState;
  return locationState?.referrer ?? "/";
};

export const Login: React.FC = () => {
  const location = useLocation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const { devLogin } = useAuthDispatchContext();
  const { isAuthenticated } = useAuthStateContext();
  const { dispatchAuthenticated } = useAuthDispatchContext();

  // Check if the user is already authenticated
  useEffect(() => {
    fetchWithRetry(getGQLUrl(), secretFieldsReq).then(() => {
      dispatchAuthenticated();
    });
  }, []);
  const loginHandler = (): void => {
    devLogin({ username, password });
  };

  const inputChangeHandler =
    (cb: (value: string) => void) =>
    (e: React.ChangeEvent<HTMLInputElement>): void => {
      cb(e.target.value);
    };

  if (isAuthenticated) {
    return <Navigate to={getReferrer(location.state)} />;
  }
  return (
    <Wrapper>
      <label htmlFor="username">Username</label>
      <input
        id="username"
        name="username"
        onChange={inputChangeHandler(setUsername)}
        type="text"
        value={username}
      />
      <label htmlFor="password">Password</label>
      <input
        id="password"
        name="password"
        onChange={inputChangeHandler(setPassword)}
        type="password"
        value={password}
      />
      <button id="login-submit" onClick={loginHandler} type="submit">
        Login
      </button>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;
