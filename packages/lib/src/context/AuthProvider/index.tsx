import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { fetchWithRetry, getUserStagingHeader } from "../../utils/request";

type AuthProviderDispatchMethods = {
  /**
   * `localLogin` is a function that logs the user in using a local authentication strategy.
   * @param credentials - credentials to login with
   * @param credentials.username - username to login with
   * @param credentials.password - password to login with
   * @returns
   */
  localLogin: (credentials: { username: string; password: string }) => void;
  /**
   * `logoutAndRedirect` is a function that logs the user out and redirects them to the login page.
   */
  logoutAndRedirect: () => void;
  /**
   * `dispatchAuthenticated` is a function that dispatches the authenticated state.
   */
  dispatchAuthenticated: () => void;
};

type AuthState = {
  /**
   * `isAuthenticated` is a boolean that determines whether the user is currently authenticated.
   */
  isAuthenticated: boolean;
};

const AuthStateContext = createContext<
  (AuthState & AuthProviderDispatchMethods) | null
>(null);

/**
 * `AuthProvider` is a context provider that manages the authentication state of the application.
 * It provides support for both local and remote authentication strategies.
 * `localAuthentication` is used for local development when connected to a local development environment and `remoteAuthentication` is used for production or when connected to a remote development environment.
 * @param props -
 * @param props.children - The children of the `AuthProvider` component.
 * @param props.localAuthURL - The URL of the local authentication provider. (Only used in local development)
 * @param props.remoteAuthURL - The URL of the remote authentication provider.
 * @param props.shouldUseLocalAuth - A boolean that determines whether to use local or remote authentication.
 * @param props.localAppURL - The URL of the local application. (Only used in local development)
 * @returns - The `AuthProvider` component.
 */
const AuthProvider: React.FC<{
  children: React.ReactNode;
  /** `localAppURL` is the URL of the backend service we will authenticate against */
  localAppURL: string;
  /** `remoteAuthURL` is the URL that we should redirect the user to if they are not currently authenticated when `shouldUseLocalAuth` is false */
  remoteAuthURL: string;
  /** `localAuthURL` is the URL that we should redirect the user to if they are not currently authenticated when `shouldUseLocalAuth` is true */
  localAuthURL: string;
  /** `shouldUseLocalAuth` determines which authentication strategy we should use. */
  shouldUseLocalAuth: boolean;
}> = ({
  children,
  localAppURL,
  localAuthURL,
  remoteAuthURL,
  shouldUseLocalAuth,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    fetchWithRetry(`${localAppURL}/graphql/query`, {
      credentials: "include",
      headers: {
        ...getUserStagingHeader(),
        "content-type": "application/json",
      },
      body: JSON.stringify({
        query: "{\n  user {\n    userId\n  }\n}",
        variables: {},
      }),
      method: "POST",
      mode: "cors",
    })
      .then(() => {
        setIsAuthenticated(true);
      })
      .catch((err) => {
        console.log(err);
        setIsAuthenticated(false);
      });
  }, [localAppURL]);

  const authMethods: AuthProviderDispatchMethods = useMemo(
    () => ({
      // This function is only used in local development.
      localLogin: async ({
        password,
        username,
      }: {
        username: string;
        password: string;
      }) => {
        await fetch(`${localAppURL}/login`, {
          body: JSON.stringify({ password, username }),
          credentials: "include",
          method: "POST",
        }).then((response) => {
          if (response.ok) {
            setIsAuthenticated(true);
          } else {
            setIsAuthenticated(false);
            // I know we don't like using alerts but this is a dev only feature
            alert("Error logging in, username or password invalid");
          }
        });
      },
      logoutAndRedirect: async () => {
        if (shouldUseLocalAuth) {
          await fetch(`${localAppURL}/logout`, {
            credentials: "include",
            method: "GET",
            redirect: "manual",
            headers: getUserStagingHeader(),
          })
            .then(() => {
              setIsAuthenticated(false);
              window.location.href = localAuthURL;
            })
            .catch((error) => {
              console.error("Logout failed", error);
            });
        } else {
          setIsAuthenticated(false);
          const encodedOrigin = encodeURIComponent(window.location.href);
          const redirectURL = `${remoteAuthURL}?redirect=${encodedOrigin}`;
          window.location.href = redirectURL;
        }
      },
      dispatchAuthenticated: () => {
        setIsAuthenticated(true);
      },
    }),
    [localAuthURL, localAppURL, remoteAuthURL, shouldUseLocalAuth],
  );

  const authProviderValue = useMemo(
    () => ({ isAuthenticated, ...authMethods }),
    [isAuthenticated, authMethods],
  );

  return (
    <AuthStateContext.Provider value={authProviderValue}>
      {children}
    </AuthStateContext.Provider>
  );
};

const useAuthProviderContext = (): AuthState & AuthProviderDispatchMethods => {
  const authState = useContext(AuthStateContext);
  if (authState === null || authState === undefined) {
    throw new Error(
      "useAuthStateContext must be used within an auth context provider",
    );
  }
  return authState;
};

export { AuthProvider, useAuthProviderContext };
