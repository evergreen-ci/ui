import { useState } from "react";
import { Button } from "@leafygreen-ui/button";
import { TextInput } from "@leafygreen-ui/text-input";
import { Location, Navigate, useLocation } from "react-router-dom";
import { FullPageLoad } from "../../components/FullPageLoad";
import { useAuthProviderContext } from "../../context/AuthProvider";
import styles from "./index.module.css";

const getReferrer = (location: Location): string => {
  const state = location.state as { referrer?: string };
  return state?.referrer ?? "/";
};
interface LoginPageProps {
  /**
   * If `ignoreAuthCheck` is true, the component will render without checking the user's authentication status.
   * This is useful for test environments where the user's authentication status is not relevant.
   */
  ignoreAuthCheck?: boolean;
}
const LoginPage: React.FC<LoginPageProps> = ({ ignoreAuthCheck }) => {
  const location = useLocation();
  const { hasCheckedAuth, isAuthenticated, localLogin } =
    useAuthProviderContext();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  if (!hasCheckedAuth && !ignoreAuthCheck) {
    return <FullPageLoad />;
  }
  return isAuthenticated ? (
    <Navigate to={getReferrer(location)} />
  ) : (
    <div className={styles.pageWrapper}>
      <form
        className={styles.loginForm}
        onSubmit={(e) => {
          e.preventDefault();
          localLogin({ password, username });
        }}
      >
        <TextInput
          data-testid="login-username"
          label="Username"
          onChange={(e) => setUsername(e.target.value)}
          type="text"
          value={username}
        />
        <TextInput
          data-testid="login-password"
          label="Password"
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          value={password}
        />
        <Button
          className={styles.submitButton}
          data-testid="login-submit"
          onClick={() => localLogin({ password, username })}
          type="submit"
          variant="baseGreen"
        >
          Login
        </Button>
      </form>
    </div>
  );
};

export default LoginPage;
